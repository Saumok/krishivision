# KrishiVision — Implementation Plan

---

## Overview

This document outlines the step-by-step build sequence for KrishiVision, optimized for rapid deployment. Each phase builds on the previous one and can be independently verified.

**Estimated Timeline:** 6–8 weeks for a small team (2–3 developers)

```
Phase 1 ──▶ Phase 2 ──▶ Phase 3 ──▶ Phase 4 ──▶ Phase 5 ──▶ Phase 6
 Setup      UX Base     AI MVP     Marketplace   Polish      Deploy
 (3 days)   (5 days)    (7 days)   (5 days)      (4 days)    (2 days)
```

---

## Phase 1: Project Setup (Days 1–3)

### Objective
Establish all infrastructure: Vercel project, Supabase project, Railway environment, repository structure, and CI/CD pipeline.

### 1.1 Vercel & Next.js Setup

| Task | Details | Done |
|------|---------|------|
| **Upgrade Next.js project** | Ensure `web/` directory has Next.js 14.2.7 with App Router | ☐ |
| **Configure `next.config.mjs`** | Add `images` config for Supabase Storage domains, add i18n config | ☐ |
| **Install core dependencies** | `@supabase/supabase-js`, `@supabase/ssr`, `next-intl`, `tailwind-merge`, `clsx`, `lucide-react`, `framer-motion`, `sonner` | ☐ |
| **Update `tailwind.config.ts`** | Add KrishiVision design tokens (colors, spacing, fonts) from `FRONTEND_GUIDELINES.md` | ☐ |
| **Configure Noto Sans fonts** | Add `Noto_Sans`, `Noto_Sans_Devanagari` via `next/font/google` in `layout.tsx` | ☐ |
| **Set up path aliases** | Ensure `@/` alias is configured in `tsconfig.json` | ☐ |
| **Create folder structure** | `app/[locale]/`, `components/`, `lib/`, `messages/`, `hooks/`, `types/` | ☐ |
| **Connect to Vercel** | Link GitHub repo, set `web/` as root directory, deploy preview | ☐ |

**Folder Structure:**

```
web/
├── app/
│   └── [locale]/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── scan/
│       │   ├── page.tsx
│       │   └── result/[id]/page.tsx
│       ├── marketplace/
│       │   ├── page.tsx
│       │   ├── [id]/page.tsx
│       │   └── new/page.tsx
│       ├── profile/
│       │   ├── page.tsx
│       │   ├── language/page.tsx
│       │   └── history/page.tsx
│       └── onboarding/
│           ├── page.tsx
│           ├── phone/page.tsx
│           └── otp/page.tsx
├── components/
│   ├── ui/           ← Reusable primitives (Button, Card, Input)
│   ├── scan/         ← ScanButton, CameraView, DiagnosisCard, RemedyCard
│   ├── marketplace/  ← MarketplaceCard, ListingForm
│   ├── layout/       ← BottomNav, Header, Shell
│   └── onboarding/   ← LanguageSelector, PhoneInput, OtpInput
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── ai-api.ts     ← Railway API client
│   ├── image-utils.ts ← Compression utilities
│   └── constants.ts
├── hooks/
│   ├── useCamera.ts
│   ├── useAuth.ts
│   └── useLocale.ts
├── messages/
│   ├── en.json
│   ├── hi.json
│   ├── bn.json
│   ├── mr.json
│   ├── te.json
│   ├── ta.json
│   ├── gu.json
│   ├── pa.json
│   └── kn.json
├── types/
│   ├── database.ts    ← Supabase generated types
│   ├── diagnosis.ts
│   └── marketplace.ts
├── public/
│   ├── manifest.json
│   ├── icons/
│   └── sw.js
├── i18n.ts
├── middleware.ts
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

### 1.2 Supabase Project Setup

| Task | Details | Done |
|------|---------|------|
| **Create Supabase project** | Region: `ap-south-1` (Mumbai), name: `krishivision` | ☐ |
| **Enable Phone Auth** | Dashboard → Auth → Providers → Phone → Enable. Configure SMS provider (Twilio / MessageBird). | ☐ |
| **Run schema migrations** | Execute all `CREATE TABLE` and `CREATE POLICY` SQL from `BACKEND_STRUCTURE.md` | ☐ |
| **Create storage buckets** | `scan-images`, `marketplace-images`, `avatars` | ☐ |
| **Set storage policies** | Apply RLS on each bucket as per `BACKEND_STRUCTURE.md` | ☐ |
| **Seed `diseases` table** | Insert initial disease entries with `model_class_index` mapping | ☐ |
| **Seed `verified_remedies`** | Insert at least 10 remedies in Hindi + English for testing | ☐ |
| **Generate TypeScript types** | `npx supabase gen types typescript --project-id <id> > types/database.ts` | ☐ |
| **Note credentials** | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | ☐ |

### 1.3 Railway Environment Setup

| Task | Details | Done |
|------|---------|------|
| **Create Railway project** | Name: `krishivision-ai` | ☐ |
| **Create `ai-service/` directory** | In repository root, alongside `web/` | ☐ |
| **Initialize FastAPI project** | `main.py`, `requirements.txt`, `Dockerfile` | ☐ |
| **Create Dockerfile** | Python 3.11 base, install TensorFlow, copy model weights | ☐ |
| **Set environment variables** | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `MODEL_PATH`, `CONFIDENCE_THRESHOLD`, `CORS_ORIGINS` | ☐ |
| **Implement `/health` endpoint** | Return status and model load state | ☐ |
| **Deploy to Railway** | Connect GitHub repo, set root to `ai-service/`, deploy | ☐ |
| **Set custom domain** | `api.krishivision.app` → Railway service | ☐ |

**AI Service Structure:**

```
ai-service/
├── main.py                ← FastAPI app entry point
├── routers/
│   ├── diagnose.py        ← POST /api/v1/diagnose
│   └── diseases.py        ← GET /api/v1/diseases
├── services/
│   ├── model_service.py   ← TensorFlow model loading & inference
│   ├── disease_mapper.py  ← Class index → disease → remedy lookup
│   └── supabase_client.py ← Supabase admin client
├── models/
│   └── best_model.keras   ← Trained model weights (or downloaded at startup)
├── utils/
│   ├── image_preprocessor.py
│   └── auth.py            ← JWT validation
├── requirements.txt
├── Dockerfile
└── .env.example
```

### 1.4 CI/CD & Repository

| Task | Details | Done |
|------|---------|------|
| **Set up GitHub repository** | Ensure proper `.gitignore` for both Python and Node.js | ☐ |
| **Create `.env.local.example`** | Document all required environment variables | ☐ |
| **GitHub Actions workflow** | Lint → Type check → Build on push/PR | ☐ |
| **Branch strategy** | `main` (production), `develop` (staging), feature branches | ☐ |

### Phase 1 Verification

- [ ] `npm run dev` starts Next.js without errors
- [ ] Supabase dashboard shows all tables with RLS enabled
- [ ] `GET https://api.krishivision.app/api/v1/health` returns `{ status: "healthy" }`
- [ ] Vercel preview deployment accessible

---

## Phase 2: Core UX & Multilingual Base (Days 4–8)

### Objective
Build the complete UI shell with navigation, i18n, onboarding flow, and design system. After this phase, the app should be fully navigable in all 9 languages with placeholder content.

### 2.1 i18n Configuration

| Task | Details | Done |
|------|---------|------|
| **Install `next-intl`** | `npm install next-intl` | ☐ |
| **Create `i18n.ts`** | Configure `getRequestConfig` with locale detection | ☐ |
| **Create `middleware.ts`** | Locale prefix routing with `next-intl/middleware` | ☐ |
| **Create all 9 `messages/*.json`** | Start with common keys: `appName`, `home`, `scan`, `marketplace`, `profile`, etc. | ☐ |
| **Update `app/` to `app/[locale]/`** | Wrap all pages in locale-aware layout | ☐ |
| **Add `useTranslations` hook** | Use in all components for text rendering | ☐ |

### 2.2 Design System Components

| Task | Details | Done |
|------|---------|------|
| **Update `globals.css`** | Apply Tailwind base, add CSS custom properties for design tokens | ☐ |
| **Build `BottomNav` component** | 3-tab navigation (Home, Marketplace, Profile) | ☐ |
| **Build `AppShell` component** | Layout wrapper with header + bottom nav + safe area padding | ☐ |
| **Build `Button` primitives** | Primary (green), Secondary (outline), Danger (red), Ghost | ☐ |
| **Build `Card` component** | Reusable card with shadow, border radius, padding | ☐ |
| **Build `Input` components** | Text input, phone input (+91 prefix), OTP input (6 boxes) | ☐ |
| **Build `LanguageSelector`** | 2-column grid of 9 language buttons | ☐ |

### 2.3 Onboarding Flow

| Task | Details | Done |
|------|---------|------|
| **Splash screen** | Logo + tagline, 1.5s auto-advance | ☐ |
| **Language selection page** | `/[locale]/onboarding` — LanguageSelector component. Selecting a language changes URL locale and stores preference. | ☐ |
| **Phone input page** | `/[locale]/onboarding/phone` — +91 prefix, 10-digit validation, large "Send OTP" button | ☐ |
| **OTP verification page** | `/[locale]/onboarding/otp` — 6-digit input, auto-advance on complete, resend timer | ☐ |
| **Supabase Auth integration** | Wire up `signInWithOtp` and `verifyOtp` calls | ☐ |
| **Auth middleware** | Redirect unauthenticated users to onboarding | ☐ |
| **Session management** | Using `@supabase/ssr` for cookie-based sessions | ☐ |

### 2.4 Home Screen

| Task | Details | Done |
|------|---------|------|
| **Home page layout** | Hero area with large scan CTA, quick tips section, recent scans (empty state) | ☐ |
| **Build `ScanButton` component** | Large green button with camera icon | ☐ |
| **Placeholder sections** | Recent scans (empty: "No scans yet"), Tips carousel | ☐ |

### Phase 2 Verification

- [ ] App starts in Hindi by default
- [ ] Language can be changed on onboarding; all UI text updates correctly in all 9 languages
- [ ] OTP flow works end-to-end with Supabase (use test phone numbers in development)
- [ ] Bottom navigation switches between Home, Marketplace (placeholder), Profile
- [ ] All buttons meet 48px minimum touch target
- [ ] Fonts render correctly for Devanagari, Bengali, Telugu, Tamil, Gujarati, Gurmukhi, Kannada scripts

---

## Phase 3: AI Scanner MVP (Days 9–15)

### Objective
Implement the complete scan → diagnose → remedy flow. This is the **core value proposition** of KrishiVision.

### 3.1 Camera Integration

| Task | Details | Done |
|------|---------|------|
| **Install `react-webcam`** | `npm install react-webcam` | ☐ |
| **Build `CameraView` component** | Full-screen camera with viewfinder overlay, shutter button, gallery fallback | ☐ |
| **Camera permission handling** | Detect denied permission, show instructional fallback with gallery upload option | ☐ |
| **Image preview screen** | Show captured/uploaded image with "Retake" and "Submit" buttons | ☐ |

### 3.2 Image Upload Pipeline

| Task | Details | Done |
|------|---------|------|
| **Install `browser-image-compression`** | `npm install browser-image-compression` | ☐ |
| **Build `image-utils.ts`** | Compression function: maxSizeMB=0.5, maxWidth=1024, JPEG output | ☐ |
| **Build `/api/upload/sign` route** | Generate Supabase Storage signed upload URL | ☐ |
| **Implement upload flow** | Compress → Get signed URL → Upload to Supabase Storage → Get public URL | ☐ |
| **Upload progress indicator** | Show real progress bar during upload | ☐ |
| **Error handling** | Auto-retry (3×), graceful failure with "save for later" option | ☐ |

### 3.3 Railway AI Endpoint

| Task | Details | Done |
|------|---------|------|
| **Implement `POST /api/v1/diagnose`** | Full endpoint as specified in `BACKEND_STRUCTURE.md` | ☐ |
| **Load MobileNetV2 model at startup** | Load from disk, keep in memory. Log load time. | ☐ |
| **Image preprocessing** | Download from URL → PIL → resize 224×224 → normalize [0,1] → numpy array | ☐ |
| **Model inference** | `model.predict()` → top-3 predictions with confidence scores | ☐ |
| **Confidence gating** | If top confidence < 0.60, return low_confidence response | ☐ |
| **Disease-to-remedy mapping** | Implement `disease_mapper.py` — lookup `verified_remedies` by disease_id + locale | ☐ |
| **Scan logging** | Insert scan record into `scans` table via Supabase service role | ☐ |
| **JWT validation** | Validate incoming Supabase JWT, extract user_id | ☐ |
| **Error handling** | Handle invalid images, model errors, timeout, rate limiting | ☐ |
| **CORS** | Allow requests from `krishivision.app` and localhost | ☐ |

### 3.4 Frontend – Diagnosis Flow

| Task | Details | Done |
|------|---------|------|
| **Build `ai-api.ts`** | Client helper to call Railway `/diagnose` endpoint with JWT | ☐ |
| **Scan page flow** | Camera → Preview → Uploading → Result page | ☐ |
| **Build `DiagnosisCard` component** | Disease name (localized), confidence bar, crop name | ☐ |
| **Build `RemedyCard` component** | Treatment, organic alternative, prevention — accordion style | ☐ |
| **Low confidence UI** | Yellow warning card + expert contact button | ☐ |
| **No remedy available UI** | Orange card + expert contact | ☐ |
| **Expert contact flow** | `/expert` page with phone number and WhatsApp deep link | ☐ |
| **Scan result page** | `/scan/result/[id]` — shows DiagnosisCard + RemedyCard | ☐ |
| **Share via WhatsApp** | Generate shareable text and deep link | ☐ |
| **Save to history** | Scan results saved and viewable in `/profile/history` | ☐ |

### 3.5 Model Training (Parallel Track)

| Task | Details | Done |
|------|---------|------|
| **Source PlantVillage dataset** | 54,000+ images, 38 disease classes, 14 crops | ☐ |
| **Fine-tune MobileNetV2** | Transfer learning, same architecture as `model.ipynb` | ☐ |
| **Evaluate model** | Target ≥ 90% top-3 accuracy on test set | ☐ |
| **Export model** | Save as `best_model.keras`, upload to Railway | ☐ |
| **Populate `diseases` table** | All 38 disease classes with localized names | ☐ |
| **Populate `verified_remedies`** | At least Hindi + English for all 38 diseases | ☐ |

### Phase 3 Verification

- [ ] Camera opens on supported devices (Android Chrome, iOS Safari)
- [ ] Image compresses to ≤ 500 KB and uploads to Supabase Storage
- [ ] Railway AI endpoint returns diagnosis within 5 seconds
- [ ] Correct disease name and remedy shown (test with known disease images)
- [ ] Low confidence scenario correctly shows expert contact
- [ ] Scan history page shows past scans with thumbnails and results
- [ ] All text displayed comes from `verified_remedies` database (zero generated text)

---

## Phase 4: Farmer Marketplace (Days 16–20)

### Objective
Build the complete marketplace for buying and selling agricultural equipment and products.

### 4.1 Marketplace Feed

| Task | Details | Done |
|------|---------|------|
| **Build marketplace page** | `/marketplace` — 2-column grid of listing cards | ☐ |
| **Build `MarketplaceCard`** | Image, title, price (₹), location, date | ☐ |
| **Category filter tabs** | All, Equipment, Seeds, Fertilizer, Pesticide, Produce, Other | ☐ |
| **Search bar** | Text search across title and description | ☐ |
| **Empty state** | "No listings yet. Be the first!" with CTA to add listing | ☐ |
| **Infinite scroll / pagination** | Load 20 items at a time, load more on scroll | ☐ |
| **Supabase query** | `marketplace_items` with status=active, ordered by created_at DESC | ☐ |

### 4.2 Listing Detail Page

| Task | Details | Done |
|------|---------|------|
| **Build detail page** | `/marketplace/[id]` — full image carousel, all details | ☐ |
| **Image carousel** | Swipeable image gallery (framer-motion or CSS snap scroll) | ☐ |
| **Contact Seller button** | Reveals phone number, opens dialer or WhatsApp | ☐ |
| **Contact count increment** | Update `contact_count` on `marketplace_items` | ☐ |
| **Seller info** | Name, member since, total listings | ☐ |

### 4.3 Add Listing Flow

| Task | Details | Done |
|------|---------|------|
| **Build add listing page** | `/marketplace/new` — multi-step form | ☐ |
| **Photo upload** | 1–4 photos via camera or gallery, compressed, uploaded to `marketplace-images` bucket | ☐ |
| **Form fields** | Title (text), Description (textarea), Price (₹ number), Category (select), Location (text + optional GPS) | ☐ |
| **Form validation** | Title required, Price > 0, at least 1 photo | ☐ |
| **Submit** | Insert into `marketplace_items` + `marketplace_images` | ☐ |
| **Success confirmation** | "Your listing is published!" with view CTA | ☐ |

### 4.4 My Listings Management

| Task | Details | Done |
|------|---------|------|
| **My listings page** | In Profile section — show user's own listings | ☐ |
| **Edit listing** | Update title, price, description, status | ☐ |
| **Mark as sold** | Change status to `sold` | ☐ |
| **Delete listing** | Soft delete (status → `removed`) with confirmation dialog | ☐ |

### Phase 4 Verification

- [ ] Marketplace feed loads and displays listings with images and prices
- [ ] Category filters work correctly
- [ ] Can create a new listing with photos in < 2 minutes
- [ ] "Contact Seller" reveals phone number and increments counter
- [ ] RLS enforced: users can only edit/delete own listings
- [ ] Listings display correctly in all supported languages

---

## Phase 5: Polish & Offline Support (Days 21–24)

### Objective
Add PWA capabilities, offline caching, performance optimizations, and UX polish.

### 5.1 PWA Configuration

| Task | Details | Done |
|------|---------|------|
| **Install Serwist** | `npm install @serwist/next @serwist/precaching` | ☐ |
| **Create `manifest.json`** | App name, icons (192×192, 512×512), theme color `#2D7A3A`, display: standalone | ☐ |
| **Generate app icons** | KrishiVision logo in required sizes | ☐ |
| **Configure service worker** | Precache static assets, runtime cache for API responses | ☐ |
| **Add meta tags** | `<meta name="theme-color">`, Apple touch icon, viewport fit=cover | ☐ |

### 5.2 Offline Strategy

| Task | Details | Done |
|------|---------|------|
| **Cache home screen** | Available offline after first visit | ☐ |
| **Cache last 5 scan results** | Store diagnosis + remedy in service worker cache / IndexedDB | ☐ |
| **Cache marketplace feed** | Last viewed 20 listings available offline | ☐ |
| **Offline indicator** | Show subtle banner: "You are offline. Some features may be limited." | ☐ |
| **Background sync** | Queue failed image uploads for retry when online | ☐ |

### 5.3 Performance Optimization

| Task | Details | Done |
|------|---------|------|
| **Bundle analysis** | Run `ANALYZE=true next build` and optimize large chunks | ☐ |
| **Image optimization** | Next.js `Image` component for all images, WebP format | ☐ |
| **Code splitting** | Dynamic imports for camera, marketplace, heavy components | ☐ |
| **Font optimization** | Subset fonts, use `display: swap`, preload critical fonts | ☐ |
| **Lighthouse audit** | Target: Performance ≥ 90, Accessibility ≥ 95 on mobile | ☐ |

### 5.4 UX Polish

| Task | Details | Done |
|------|---------|------|
| **Page transitions** | Smooth fade/slide between screens (framer-motion) | ☐ |
| **Loading skeletons** | Skeleton UI for marketplace feed, scan history | ☐ |
| **Toast notifications** | Success/error toasts using Sonner | ☐ |
| **Pull-to-refresh** | On marketplace feed (mobile gesture) | ☐ |
| **Read Aloud button** | TTS for diagnosis results and remedies | ☐ |
| **Error boundary** | Global error boundary with "Go Home" / "Reload" | ☐ |
| **Analytics setup** | PostHog or simple event tracking for key flows | ☐ |

### Phase 5 Verification

- [ ] App installs as PWA on Android (Add to Home Screen prompt)
- [ ] Home screen loads offline after first visit
- [ ] Last 5 scan results viewable offline
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95, PWA ≥ 90 (mobile)
- [ ] Bundle size < 200 KB initial JS (gzipped)
- [ ] Read Aloud works in Hindi, Telugu, Tamil

---

## Phase 6: Final Deployment (Days 25–26)

### Objective
Production deployment, domain configuration, final testing, and launch readiness.

### 6.1 Domain & DNS

| Task | Details | Done |
|------|---------|------|
| **Register domain** | `krishivision.app` (or `.in`) | ☐ |
| **Configure Vercel domain** | Point `krishivision.app` → Vercel | ☐ |
| **Configure Railway domain** | Point `api.krishivision.app` → Railway service | ☐ |
| **SSL certificates** | Auto-provisioned by Vercel and Railway | ☐ |

### 6.2 Production Environment Variables

| Task | Details | Done |
|------|---------|------|
| **Set Vercel env vars** | All `NEXT_PUBLIC_*` variables for production | ☐ |
| **Set Railway env vars** | All AI service variables for production | ☐ |
| **Configure Supabase site URL** | `https://krishivision.app` | ☐ |
| **Set SMS provider for production** | Twilio/MessageBird production credentials | ☐ |
| **Review CORS settings** | Railway only allows `krishivision.app` origin | ☐ |

### 6.3 Pre-Launch Checklist

| Task | Details | Done |
|------|---------|------|
| **End-to-end test: Scan flow** | Full flow on 3G-throttled Android device | ☐ |
| **End-to-end test: Marketplace** | Create listing, browse, contact seller | ☐ |
| **End-to-end test: Multilingual** | Test all 9 languages for onboarding, scan, remedy display | ☐ |
| **Security audit** | Verify RLS policies, no exposed service keys, CORS locked | ☐ |
| **Load test** | 100 concurrent scan requests to Railway | ☐ |
| **Supabase backup** | Enable daily backups, verify restore process | ☐ |
| **Error monitoring** | Set up error tracking (Sentry or similar) | ☐ |
| **Uptime monitoring** | Set up health checks on Railway and Vercel | ☐ |

### 6.4 Launch

| Task | Details | Done |
|------|---------|------|
| **Vercel production deploy** | Merge to `main`, auto-deploy | ☐ |
| **Railway production deploy** | Deploy from `main` branch | ☐ |
| **Smoke test production** | Full scan + marketplace flow on production URL | ☐ |
| **Monitor logs** | Watch Railway logs, Supabase logs for first 24 hours | ☐ |

### Phase 6 Verification

- [ ] `https://krishivision.app` loads in < 3 seconds on 3G
- [ ] Full scan flow works in production
- [ ] OTP SMS delivered in < 10 seconds
- [ ] No console errors, no 500s in first 24 hours
- [ ] PWA installable on Android Chrome

---

## Post-Launch Roadmap

| Phase | Feature                   | Estimated Timeline |
|-------|---------------------------|--------------------|
| 7     | In-app chat (Supabase Realtime) | +2 weeks      |
| 8     | Voice input for search/listing  | +1 week       |
| 9     | Weather integration            | +1 week       |
| 10    | Community forum                | +3 weeks      |
| 11    | Government scheme alerts       | +1 week       |
| 12    | iOS optimization               | +2 weeks      |

---

## Risk Register

| Risk                                    | Impact | Probability | Mitigation                                                            |
|-----------------------------------------|--------|-------------|-----------------------------------------------------------------------|
| **Model accuracy below 90%**           | High   | Medium      | Use ensemble of MobileNetV2 + EfficientNet. Expand training data.    |
| **SMS OTP delivery failures**          | High   | Low         | Use 2 SMS providers with auto-fallback. Show "resend" prominently.   |
| **Railway cold starts (slow inference)**| Medium | High        | Keep minimum 1 instance always running. Pre-load model at startup.   |
| **Supabase free tier limits**          | Medium | Low         | Start on Pro tier. Monitor connection count and storage usage.       |
| **Indic font rendering issues**        | Medium | Medium      | Extensive testing on low-end Android devices. Fallback to system fonts.|
| **Low adoption by farmers**            | High   | Medium      | Partner with Krishi Vigyan Kendras for on-ground training + QR codes.|

---

*End of Implementation Plan — KrishiVision v1.0.0*
