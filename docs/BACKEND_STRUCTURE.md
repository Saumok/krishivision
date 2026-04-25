# KrishiVision — Backend Structure & Database Architecture

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         KRISHIVISION SYSTEM ARCHITECTURE                         │
│                                                                                  │
│   ┌──────────┐                                                                   │
│   │  FARMER  │                                                                   │
│   │  (PWA)   │                                                                   │
│   └────┬─────┘                                                                   │
│        │                                                                         │
│        ├──── HTTPS ────────────────────────┐                                     │
│        │                                   │                                     │
│   ┌────▼─────────────────┐    ┌───────────▼────────────────┐                    │
│   │  VERCEL EDGE          │    │  RAILWAY AI MICROSERVICE    │                    │
│   │  (Next.js Frontend)   │    │  (FastAPI + TensorFlow)     │                    │
│   │                       │    │                             │                    │
│   │  • SSR Pages          │    │  • POST /api/v1/diagnose    │                    │
│   │  • API Routes (proxy) │    │  • GET  /api/v1/health      │                    │
│   │  • Static Assets      │    │  • MobileNetV2 Inference    │                    │
│   │  • Service Worker     │    │  • Image Preprocessing      │                    │
│   └────┬─────────────────┘    └───────────┬────────────────┘                    │
│        │                                   │                                     │
│        │          ┌────────────────────────┤                                     │
│        │          │                        │                                     │
│   ┌────▼──────────▼───────────────────────▼────────────────┐                    │
│   │              SUPABASE (ap-south-1 / Mumbai)             │                    │
│   │                                                         │                    │
│   │  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐ │                    │
│   │  │  PostgreSQL  │  │  Supabase    │  │  Supabase     │ │                    │
│   │  │  Database    │  │  Auth (OTP)  │  │  Storage      │ │                    │
│   │  │             │  │              │  │  (Images)     │ │                    │
│   │  │  • users     │  │  • Phone OTP │  │  • scan-imgs  │ │                    │
│   │  │  • scans     │  │  • JWT       │  │  • mkt-imgs   │ │                    │
│   │  │  • remedies  │  │  • Sessions  │  │  • avatars    │ │                    │
│   │  │  • mkt_items │  │              │  │              │ │                    │
│   │  └─────────────┘  └──────────────┘  └───────────────┘ │                    │
│   └─────────────────────────────────────────────────────────┘                    │
│                                                                                  │
│   DATA FLOW:                                                                     │
│   1. Client → Supabase: Auth, CRUD, Image Upload                                │
│   2. Client → Railway: AI Inference (image → diagnosis)                          │
│   3. Railway → Supabase: Fetch verified_remedies, log scan results               │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Key Architecture Decisions

| Decision                                          | Rationale                                                                 |
|---------------------------------------------------|---------------------------------------------------------------------------|
| **Supabase for Auth + DB + Storage**              | Single managed service reduces ops burden. PostgreSQL is battle-tested.   |
| **Railway for AI only**                           | GPU/CPU-optimized containers for TensorFlow. Separate scaling from frontend. |
| **No LLM / No OpenAI in the pipeline**            | Anti-hallucination mandate. Classification model + DB lookup only.        |
| **Client uploads directly to Supabase Storage**   | Reduces Railway bandwidth. Railway receives a signed URL, not raw bytes.  |
| **Vercel Edge for frontend**                      | Global CDN, SSR, ISR. Mumbai region for Indian users.                    |

---

## 2. Database Schema

### 2.1 Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌────────────────────┐
│    users      │       │     diseases      │       │  verified_remedies  │
├──────────────┤       ├──────────────────┤       ├────────────────────┤
│ id (PK)       │       │ id (PK)           │       │ id (PK)             │
│ phone         │       │ name_en           │  1──▶N │ disease_id (FK)     │
│ name          │       │ name_hi           │       │ language             │
│ locale        │       │ crop_en           │       │ treatment            │
│ avatar_url    │       │ crop_hi           │       │ organic_alternative  │
│ created_at    │       │ model_class_index │       │ prevention           │
│ updated_at    │       │ severity          │       │ source               │
└──────┬───────┘       │ created_at        │       │ verified_by          │
       │                └────────┬─────────┘       │ verified_at          │
       │                         │                  │ created_at           │
       │    ┌────────────────────┤                  └────────────────────┘
       │    │                    │
       │    │   ┌────────────────▼───────────────┐
       │    │   │          scans                  │
       │    │   ├────────────────────────────────┤
       │    └──▶│ id (PK)                         │
       │        │ user_id (FK → users.id)         │
       └───────▶│ image_url                       │
                │ disease_id (FK → diseases.id)   │
                │ confidence_score                │
                │ top_3_predictions (JSONB)        │
                │ remedy_shown (BOOLEAN)           │
                │ expert_escalated (BOOLEAN)       │
                │ created_at                       │
                └─────────────────────────────────┘

┌────────────────────────────────────┐     ┌────────────────────────┐
│        marketplace_items            │     │   marketplace_images    │
├────────────────────────────────────┤     ├────────────────────────┤
│ id (PK)                             │     │ id (PK)                 │
│ seller_id (FK → users.id)           │ 1─▶N│ item_id (FK)            │
│ title                               │     │ image_url               │
│ description                         │     │ display_order           │
│ price (DECIMAL)                     │     │ created_at              │
│ category (ENUM)                     │     └────────────────────────┘
│ location_text                       │
│ location_lat (DECIMAL)              │
│ location_lng (DECIMAL)              │
│ status (ENUM: active/sold/removed)  │
│ contact_count (INT)                 │
│ created_at                          │
│ updated_at                          │
└────────────────────────────────────┘
```

### 2.2 Table Definitions

#### `users`

```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone         TEXT UNIQUE NOT NULL,
  name          TEXT,
  locale        TEXT NOT NULL DEFAULT 'hi',
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);
```

#### `diseases`

```sql
CREATE TABLE diseases (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en             TEXT NOT NULL,
  name_hi             TEXT,
  name_bn             TEXT,
  name_mr             TEXT,
  name_te             TEXT,
  name_ta             TEXT,
  name_gu             TEXT,
  name_pa             TEXT,
  name_kn             TEXT,
  crop_en             TEXT NOT NULL,
  crop_hi             TEXT,
  crop_bn             TEXT,
  crop_mr             TEXT,
  crop_te             TEXT,
  crop_ta             TEXT,
  crop_gu             TEXT,
  crop_pa             TEXT,
  crop_kn             TEXT,
  model_class_index   INTEGER NOT NULL UNIQUE,
  severity            TEXT CHECK (severity IN ('low', 'medium', 'high')) DEFAULT 'medium',
  description_en      TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: Public read, no public write
ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read diseases"
  ON diseases FOR SELECT
  USING (true);
```

#### `verified_remedies`

```sql
CREATE TABLE verified_remedies (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disease_id            UUID NOT NULL REFERENCES diseases(id) ON DELETE CASCADE,
  language              TEXT NOT NULL,
  treatment             TEXT NOT NULL,
  organic_alternative   TEXT,
  prevention            TEXT,
  dosage_instructions   TEXT,
  source                TEXT NOT NULL,  -- e.g., 'ICAR', 'State Agri University'
  verified_by           TEXT NOT NULL,  -- Name of verifying agronomist
  verified_at           TIMESTAMPTZ NOT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(disease_id, language)
);

-- Index for fast lookup
CREATE INDEX idx_remedies_disease_lang ON verified_remedies(disease_id, language);

-- RLS: Public read, no public write
ALTER TABLE verified_remedies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read verified remedies"
  ON verified_remedies FOR SELECT
  USING (true);
```

#### `scans`

```sql
CREATE TABLE scans (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url           TEXT NOT NULL,
  disease_id          UUID REFERENCES diseases(id),
  confidence_score    DECIMAL(5,4),
  top_3_predictions   JSONB,
  -- Example: [{"disease_id": "...", "confidence": 0.87}, {"disease_id": "...", "confidence": 0.08}]
  remedy_shown        BOOLEAN NOT NULL DEFAULT FALSE,
  expert_escalated    BOOLEAN NOT NULL DEFAULT FALSE,
  user_locale         TEXT NOT NULL DEFAULT 'hi',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_scans_user ON scans(user_id, created_at DESC);
CREATE INDEX idx_scans_disease ON scans(disease_id);

-- RLS
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own scans"
  ON scans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans"
  ON scans FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### `marketplace_items`

```sql
CREATE TYPE marketplace_category AS ENUM (
  'equipment',
  'seeds',
  'fertilizer',
  'pesticide',
  'produce',
  'other'
);

CREATE TYPE marketplace_status AS ENUM (
  'active',
  'sold',
  'removed'
);

CREATE TABLE marketplace_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  price           DECIMAL(12,2) NOT NULL,
  category        marketplace_category NOT NULL DEFAULT 'other',
  location_text   TEXT,
  location_lat    DECIMAL(10,7),
  location_lng    DECIMAL(10,7),
  status          marketplace_status NOT NULL DEFAULT 'active',
  contact_count   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_marketplace_status ON marketplace_items(status, created_at DESC);
CREATE INDEX idx_marketplace_seller ON marketplace_items(seller_id);
CREATE INDEX idx_marketplace_category ON marketplace_items(category, status);

-- RLS
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active listings"
  ON marketplace_items FOR SELECT
  USING (status = 'active' OR auth.uid() = seller_id);

CREATE POLICY "Users can insert own listings"
  ON marketplace_items FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update own listings"
  ON marketplace_items FOR UPDATE
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can delete own listings"
  ON marketplace_items FOR DELETE
  USING (auth.uid() = seller_id);
```

#### `marketplace_images`

```sql
CREATE TABLE marketplace_images (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id         UUID NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
  image_url       TEXT NOT NULL,
  display_order   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mkt_images_item ON marketplace_images(item_id, display_order);

-- RLS
ALTER TABLE marketplace_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read marketplace images"
  ON marketplace_images FOR SELECT
  USING (true);

CREATE POLICY "Sellers can insert images for own items"
  ON marketplace_images FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT seller_id FROM marketplace_items WHERE id = item_id)
  );
```

---

## 3. API Endpoints

### 3.1 Railway AI Microservice API

Base URL: `https://api.krishivision.app/api/v1`

---

#### `GET /health`

Health check for Railway auto-scaling and monitoring.

| Field       | Value          |
|-------------|----------------|
| **Auth**    | None           |
| **Rate Limit** | None        |

**Response:**

```json
{
  "status": "healthy",
  "model_loaded": true,
  "version": "1.0.0",
  "uptime_seconds": 3600
}
```

---

#### `POST /diagnose`

Core AI diagnosis endpoint. Receives an image URL (already uploaded to Supabase Storage), runs inference, stores the scan record, and returns the diagnosis with verified remedy.

| Field        | Value                                     |
|--------------|-------------------------------------------|
| **Auth**     | Bearer token (Supabase JWT, validated)    |
| **Rate Limit**| 10 requests / minute / user             |
| **Timeout**  | 30 seconds                                |

**Request:**

```json
{
  "image_url": "https://xxxx.supabase.co/storage/v1/object/sign/scan-images/user123/abc.jpg?token=...",
  "user_locale": "hi",
  "user_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response — Successful Diagnosis (confidence ≥ 0.60):**

```json
{
  "success": true,
  "scan_id": "660e9500-f30c-52e5-b827-557766551111",
  "diagnosis": {
    "disease_id": "770ea600-g41d-63f6-c938-668877662222",
    "disease_name": "Early Blight",
    "disease_name_localized": "अगेती अंगमारी",
    "crop": "Tomato",
    "crop_localized": "टमाटर",
    "confidence": 0.87,
    "severity": "high",
    "top_3": [
      { "disease_name": "Early Blight", "confidence": 0.87 },
      { "disease_name": "Late Blight", "confidence": 0.08 },
      { "disease_name": "Leaf Mold", "confidence": 0.03 }
    ]
  },
  "remedy": {
    "treatment": "मैंकोज़ेब 2.5 ग्राम/लीटर पानी में घोलकर छिड़काव करें। 10-14 दिन के अंतराल पर दोहराएं।",
    "organic_alternative": "नीम तेल 5 मिली/लीटर पानी में मिलाकर सुबह या शाम छिड़काव करें।",
    "prevention": "फसल चक्र अपनाएं। संक्रमित पत्तियां तुरंत हटाएं। पौधों के बीच उचित दूरी रखें।",
    "source": "ICAR - Indian Institute of Vegetable Research",
    "verified_by": "Dr. Rajesh Kumar, Plant Pathologist"
  },
  "expert_escalated": false
}
```

**Response — Low Confidence (< 0.60):**

```json
{
  "success": true,
  "scan_id": "660e9500-f30c-52e5-b827-557766551111",
  "diagnosis": {
    "disease_id": null,
    "disease_name": null,
    "confidence": 0.42,
    "top_3": [
      { "disease_name": "Early Blight", "confidence": 0.42 },
      { "disease_name": "Septoria Leaf Spot", "confidence": 0.28 },
      { "disease_name": "Bacterial Spot", "confidence": 0.15 }
    ]
  },
  "remedy": null,
  "expert_escalated": true,
  "message": "हम निश्चित नहीं हैं। कृपया विशेषज्ञ से संपर्क करें।",
  "expert_contact": {
    "phone": "+91-XXXXXXXXXX",
    "whatsapp": "https://wa.me/91XXXXXXXXXX"
  }
}
```

**Response — No Remedy Available:**

```json
{
  "success": true,
  "scan_id": "660e9500-f30c-52e5-b827-557766551111",
  "diagnosis": {
    "disease_id": "770ea600-g41d-63f6-c938-668877662222",
    "disease_name": "Cercospora Leaf Spot",
    "confidence": 0.78,
    "severity": "medium"
  },
  "remedy": null,
  "remedy_unavailable": true,
  "expert_escalated": true,
  "message": "इस रोग का उपचार अभी हमारे डेटाबेस में उपलब्ध नहीं है। हम विशेषज्ञ से जोड़ रहे हैं।"
}
```

**Error Responses:**

| Status | Code                | Description                                |
|--------|---------------------|--------------------------------------------|
| 400    | `INVALID_IMAGE`     | Image URL is invalid or cannot be fetched  |
| 401    | `UNAUTHORIZED`      | Invalid or expired JWT token               |
| 413    | `IMAGE_TOO_LARGE`   | Image exceeds 5 MB limit                   |
| 429    | `RATE_LIMITED`       | Too many requests                          |
| 500    | `INFERENCE_ERROR`   | Model inference failed                     |
| 503    | `MODEL_NOT_LOADED`  | Model is still loading at startup          |

---

#### `GET /diseases`

List all supported diseases (used for admin/reference).

| Field       | Value                           |
|-------------|---------------------------------|
| **Auth**    | Bearer token (Supabase JWT)     |
| **Cache**   | CDN-cached for 1 hour           |

**Response:**

```json
{
  "count": 38,
  "diseases": [
    {
      "id": "...",
      "name_en": "Early Blight",
      "name_hi": "अगेती अंगमारी",
      "crop_en": "Tomato",
      "crop_hi": "टमाटर",
      "model_class_index": 12,
      "severity": "high",
      "has_remedy": { "hi": true, "en": true, "bn": false, "te": true }
    }
  ]
}
```

---

### 3.2 Next.js API Routes (Vercel Edge)

These are lightweight proxy routes in the Next.js app that handle Supabase operations.

| Route                         | Method | Purpose                              |
|-------------------------------|--------|--------------------------------------|
| `/api/auth/otp/send`          | POST   | Trigger Supabase OTP send            |
| `/api/auth/otp/verify`        | POST   | Verify OTP and create session        |
| `/api/scans/history`          | GET    | Fetch authenticated user's scan history |
| `/api/marketplace/listings`   | GET    | List marketplace items (with filters)|
| `/api/marketplace/listings`   | POST   | Create new marketplace listing       |
| `/api/marketplace/listings/[id]` | PATCH | Update listing (owner only)       |
| `/api/marketplace/listings/[id]` | DELETE | Delete listing (owner only)      |
| `/api/marketplace/contact/[id]` | POST  | Reveal seller contact + increment counter |
| `/api/upload/sign`            | POST   | Generate signed upload URL for Supabase Storage |

---

## 4. Anti-Hallucination RAG Setup

> **This is NOT a traditional RAG (Retrieval-Augmented Generation) system.** There is no LLM in the pipeline. The term "RAG" is used loosely to describe the pattern: **Classify → Retrieve → Display**.

### 4.1 Pipeline Detail

```
STEP 1: IMAGE CLASSIFICATION (Railway)
┌─────────────────────────────────────────────┐
│  Input: Plant disease image (224×224×3)      │
│  Model: MobileNetV2 (fine-tuned)             │
│  Output: class_probabilities[N_diseases]     │
│                                              │
│  top_1 = argmax(class_probabilities)          │
│  confidence = class_probabilities[top_1]      │
└──────────────────┬──────────────────────────┘
                   ↓

STEP 2: CONFIDENCE GATE
┌─────────────────────────────────────────────┐
│  IF confidence >= 0.60:                      │
│     disease_id = diseases[top_1].id          │
│     → PROCEED TO STEP 3                      │
│  ELSE:                                       │
│     → RETURN low_confidence_response         │
│     → SET expert_escalated = TRUE            │
│     → SKIP STEP 3                            │
└──────────────────┬──────────────────────────┘
                   ↓

STEP 3: STRICT DATABASE LOOKUP (Supabase)
┌─────────────────────────────────────────────┐
│  SELECT treatment, organic_alternative,      │
│         prevention, source, verified_by      │
│  FROM verified_remedies                      │
│  WHERE disease_id = :disease_id              │
│  AND language = :user_locale                 │
│                                              │
│  IF rows_returned == 0:                      │
│     → RETURN remedy_unavailable_response     │
│     → SET expert_escalated = TRUE            │
│  ELSE:                                       │
│     → RETURN full_diagnosis_response         │
└──────────────────┬──────────────────────────┘
                   ↓

STEP 4: AUDIT LOG (Supabase)
┌─────────────────────────────────────────────┐
│  INSERT INTO scans (                         │
│    user_id, image_url, disease_id,           │
│    confidence_score, top_3_predictions,      │
│    remedy_shown, expert_escalated,           │
│    user_locale                               │
│  )                                           │
│                                              │
│  Every single interaction is logged for:     │
│  • Human audit of AI accuracy                │
│  • Identifying diseases without remedies     │
│  • Analytics & reporting                     │
└─────────────────────────────────────────────┘
```

### 4.2 What Makes This Anti-Hallucination?

| Property                            | Traditional LLM RAG             | KrishiVision Approach              |
|-------------------------------------|----------------------------------|------------------------------------|
| **Text Generation**                 | LLM generates text from context | ZERO text generation               |
| **Source of Remedy Text**           | LLM summarizes retrieved docs   | Database row returned verbatim     |
| **Risk of Incorrect Info**          | High (hallucination possible)   | Zero (only human-verified data)    |
| **Unknown Disease Handling**        | LLM may guess                   | Explicit "unknown" + expert referral|
| **Low Confidence Handling**         | LLM may still generate answer   | Hard gate: no remedy below 60%     |
| **Audit Trail**                     | Often no logging                | Every interaction logged            |

### 4.3 Class-to-Disease Mapping

The model's `model_class_index` (integer output from softmax) maps to the `diseases` table:

```python
# ai-service/disease_mapper.py

async def map_prediction_to_remedy(
    class_index: int,
    confidence: float,
    user_locale: str,
    supabase_client
) -> dict:
    """
    Maps a model prediction to a verified remedy.
    NO text generation. Pure database lookup.
    """
    # Step 1: Get disease from class index
    disease = await supabase_client.table('diseases') \
        .select('*') \
        .eq('model_class_index', class_index) \
        .single() \
        .execute()

    if not disease.data:
        return {"error": "UNMAPPED_CLASS", "class_index": class_index}

    # Step 2: Confidence gate
    if confidence < 0.60:
        return {
            "disease": disease.data,
            "confidence": confidence,
            "remedy": None,
            "expert_escalated": True,
            "reason": "LOW_CONFIDENCE"
        }

    # Step 3: Fetch verified remedy
    remedy = await supabase_client.table('verified_remedies') \
        .select('*') \
        .eq('disease_id', disease.data['id']) \
        .eq('language', user_locale) \
        .single() \
        .execute()

    if not remedy.data:
        # Try English fallback
        remedy = await supabase_client.table('verified_remedies') \
            .select('*') \
            .eq('disease_id', disease.data['id']) \
            .eq('language', 'en') \
            .single() \
            .execute()

    return {
        "disease": disease.data,
        "confidence": confidence,
        "remedy": remedy.data if remedy.data else None,
        "expert_escalated": remedy.data is None,
        "reason": "REMEDY_UNAVAILABLE" if not remedy.data else None
    }
```

---

## 5. Authentication

### 5.1 Supabase Phone / OTP Auth

KrishiVision uses **phone number + OTP** as the sole authentication method. No passwords, no email, no social login.

| Decision                | Rationale                                                    |
|-------------------------|--------------------------------------------------------------|
| **Phone OTP only**      | Every Indian farmer has a phone number. Many don't have email.|
| **No password**         | Reduces friction. OTP is simpler to understand.              |
| **6-digit OTP**         | Standard, easy to read from SMS.                             |
| **30-second cooldown**  | Prevents OTP spam.                                           |
| **Session: 7 days**     | Long sessions avoid frequent re-auth for low-tech users.     |

### 5.2 Auth Flow (Supabase SDK)

```typescript
// 1. Send OTP
const { error } = await supabase.auth.signInWithOtp({
  phone: '+91' + phoneNumber,
});

// 2. Verify OTP
const { data, error } = await supabase.auth.verifyOtp({
  phone: '+91' + phoneNumber,
  token: otpCode,
  type: 'sms',
});

// 3. On success, create/update user profile
if (data.user) {
  await supabase.from('users').upsert({
    id: data.user.id,
    phone: data.user.phone,
    locale: selectedLocale,
  });
}

// 4. Get session (auto-managed by @supabase/ssr)
const { data: { session } } = await supabase.auth.getSession();
```

### 5.3 JWT Token Flow

```
Client (PWA)
  ↓ signInWithOtp()
Supabase Auth
  ↓ Returns JWT (access_token + refresh_token)
Client stores in httpOnly cookie (@supabase/ssr)
  ↓
Client → Vercel API routes: JWT sent in cookie (auto by SSR middleware)
Client → Railway AI API: JWT sent as Authorization: Bearer <token>
  ↓
Railway validates JWT using Supabase JWT secret (SUPABASE_JWT_SECRET env var)
```

---

## 6. Image Storage Pipeline

### 6.1 Upload Flow

```
FARMER CAPTURES PHOTO
       ↓
CLIENT-SIDE COMPRESSION (browser-image-compression)
  • maxSizeMB: 0.5 (500 KB)
  • maxWidthOrHeight: 1024
  • useWebWorker: true
  • fileType: 'image/jpeg'
  • initialQuality: 0.8
       ↓
GET SIGNED UPLOAD URL
  POST /api/upload/sign
  → Returns: signed URL for Supabase Storage
       ↓
UPLOAD TO SUPABASE STORAGE
  PUT to signed URL
  Bucket: 'scan-images'
  Path: '{user_id}/{timestamp}_{random}.jpg'
       ↓
GET PUBLIC/SIGNED URL
  Used to pass to Railway AI API
       ↓
RAILWAY DOWNLOADS IMAGE
  Downloads from Supabase Storage signed URL
  Preprocesses: resize to 224×224, normalize [0,1]
  Runs inference
```

### 6.2 Storage Bucket Configuration

```sql
-- Supabase Storage policies (via Dashboard or SQL)

-- Bucket: scan-images
-- Authenticated users can upload to their own folder
CREATE POLICY "Users upload own scan images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'scan-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Authenticated users can read own images
CREATE POLICY "Users read own scan images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'scan-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Bucket: marketplace-images
-- Authenticated users can upload
CREATE POLICY "Users upload marketplace images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'marketplace-images'
    AND auth.role() = 'authenticated'
  );

-- Anyone can read marketplace images (public listings)
CREATE POLICY "Public read marketplace images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'marketplace-images');
```

### 6.3 Compression Settings

| Setting                  | Scan Images         | Marketplace Images  |
|--------------------------|---------------------|---------------------|
| **Max File Size**        | 500 KB              | 1 MB                |
| **Max Resolution**       | 1024 × 1024         | 1200 × 1200         |
| **Format**               | JPEG                | JPEG                |
| **Quality**              | 0.8                 | 0.85                |
| **Thumbnail Generated**  | No (not needed)     | Yes (200×200, 0.7q) |

### 6.4 Image Retention Policy

| Bucket               | Retention  | Reason                                              |
|-----------------------|------------|-----------------------------------------------------|
| `scan-images`         | 90 days    | Needed for audit, model retraining. Auto-delete after 90d. |
| `marketplace-images`  | Indefinite | Active listings need images. Cleanup on listing deletion. |
| `avatars`             | Indefinite | User profile photo. Cleanup on account deletion.    |

---

*End of Backend Structure Documentation — KrishiVision v1.0.0*
