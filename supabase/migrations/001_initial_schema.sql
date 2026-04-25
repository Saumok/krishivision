-- ============================================================
-- KrishiVision — Complete Supabase Schema Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE: users (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone       TEXT,
  name        TEXT,
  locale      TEXT DEFAULT 'hi',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"   ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, phone, locale)
  VALUES (NEW.id, NEW.phone, 'hi')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TABLE: diseases (master list, 38 classes)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.diseases (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,          -- matches classLabels.ts slug
  model_class_idx INTEGER UNIQUE NOT NULL,        -- TF.js output index (0–37)
  name_en         TEXT NOT NULL,
  crop_en         TEXT NOT NULL,
  is_healthy      BOOLEAN DEFAULT FALSE,
  severity        TEXT DEFAULT 'medium' CHECK (severity IN ('none','low','medium','high')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.diseases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Diseases are publicly readable" ON public.diseases FOR SELECT USING (true);

CREATE INDEX idx_diseases_slug ON public.diseases(slug);
CREATE INDEX idx_diseases_class_idx ON public.diseases(model_class_idx);

-- ============================================================
-- TABLE: verified_remedies (expert-curated, per disease+language)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.verified_remedies (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disease_id          UUID NOT NULL REFERENCES public.diseases(id) ON DELETE CASCADE,
  language            TEXT NOT NULL,             -- 'en', 'hi', 'te', etc.
  treatment           TEXT NOT NULL,             -- Main treatment text
  organic_alternative TEXT NOT NULL,             -- Organic/natural alternative
  prevention          TEXT NOT NULL,             -- Prevention tips
  source              TEXT,                      -- e.g. "ICAR, 2023"
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (disease_id, language)
);

ALTER TABLE public.verified_remedies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Remedies are publicly readable" ON public.verified_remedies FOR SELECT USING (true);

CREATE INDEX idx_remedies_disease_lang ON public.verified_remedies(disease_id, language);

-- ============================================================
-- TABLE: scans (user scan history)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.scans (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  image_url         TEXT,
  disease_slug      TEXT,
  disease_name      TEXT,
  crop_name         TEXT,
  confidence        NUMERIC(5,4),               -- 0.0000 to 1.0000
  top3              JSONB,                       -- [{slug, confidence}, ...]
  is_low_confidence BOOLEAN DEFAULT FALSE,
  remedy_shown      BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own scans"   ON public.scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scans" ON public.scans FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_scans_user_id  ON public.scans(user_id);
CREATE INDEX idx_scans_created  ON public.scans(created_at DESC);

-- ============================================================
-- TABLE: marketplace_items
-- ============================================================
CREATE TABLE IF NOT EXISTS public.marketplace_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  price         INTEGER NOT NULL,               -- Price in INR (no decimals)
  category      TEXT NOT NULL CHECK (category IN ('equipment','seeds','fertilizer','pesticide','produce','other')),
  location      TEXT NOT NULL,
  status        TEXT DEFAULT 'active' CHECK (status IN ('active','sold','removed')),
  contact_count INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active listings" ON public.marketplace_items FOR SELECT USING (status = 'active');
CREATE POLICY "Users can insert own listings"   ON public.marketplace_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own listings"   ON public.marketplace_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own listings"   ON public.marketplace_items FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_mktpl_user_id  ON public.marketplace_items(user_id);
CREATE INDEX idx_mktpl_status   ON public.marketplace_items(status);
CREATE INDEX idx_mktpl_category ON public.marketplace_items(category);
CREATE INDEX idx_mktpl_created  ON public.marketplace_items(created_at DESC);

-- ============================================================
-- TABLE: marketplace_images
-- ============================================================
CREATE TABLE IF NOT EXISTS public.marketplace_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id     UUID NOT NULL REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.marketplace_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view marketplace images" ON public.marketplace_images FOR SELECT USING (true);
CREATE POLICY "Item owners can manage images"      ON public.marketplace_images FOR ALL
  USING (EXISTS (SELECT 1 FROM public.marketplace_items WHERE id = item_id AND user_id = auth.uid()));

CREATE INDEX idx_mktpl_images_item ON public.marketplace_images(item_id);

-- ============================================================
-- STORAGE BUCKETS (run separately if needed)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES
--   ('scan-images', 'scan-images', false),
--   ('marketplace-images', 'marketplace-images', true),
--   ('avatars', 'avatars', false)
-- ON CONFLICT DO NOTHING;
