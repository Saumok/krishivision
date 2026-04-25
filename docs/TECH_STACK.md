# KrishiVision — Technology Stack Documentation

---

## 1. Stack Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          KRISHIVISION STACK                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐ │
│   │   FRONTEND        │    │   BACKEND / AI    │    │   DATABASE       │ │
│   │   (Vercel)        │    │   (Railway)       │    │   (Supabase)     │ │
│   │                   │    │                   │    │                  │ │
│   │   Next.js 14      │───▶│   FastAPI         │───▶│   PostgreSQL     │ │
│   │   React 18        │    │   Python 3.11+    │    │   Supabase Auth  │ │
│   │   Tailwind CSS 3  │    │   TensorFlow      │    │   Supabase       │ │
│   │   next-intl       │    │   MobileNetV2     │    │     Storage      │ │
│   │   PWA (Serwist)   │    │   Pillow          │    │   Row Level      │ │
│   │                   │    │                   │    │     Security     │ │
│   └──────────────────┘    └──────────────────┘    └──────────────────┘ │
│                                                                         │
│   Client ──HTTP──▶ Vercel Edge ──▶ Supabase (data, auth, storage)      │
│   Client ──HTTP──▶ Railway API ──▶ AI inference ──▶ Supabase (lookup)  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Stack

### 2.1 Core Framework

| Technology       | Version   | Purpose                                      |
|------------------|-----------|----------------------------------------------|
| **Next.js**      | `14.2.7`  | React framework with App Router, SSR, ISR    |
| **React**        | `^18`     | UI component library                         |
| **React DOM**    | `^18`     | DOM rendering                                |
| **TypeScript**   | `^5`      | Type safety                                  |

### 2.2 Styling

| Technology         | Version    | Purpose                                     |
|--------------------|------------|---------------------------------------------|
| **Tailwind CSS**   | `^3.4.1`  | Utility-first responsive styling             |
| **PostCSS**        | `^8`      | CSS processing pipeline                      |
| **tailwind-merge** | `^2.2.0`  | Merge Tailwind classes without conflicts     |
| **clsx**           | `^2.1.0`  | Conditional class name construction          |

### 2.3 Internationalization (i18n)

| Technology     | Version   | Purpose                                          |
|----------------|-----------|--------------------------------------------------|
| **next-intl**  | `^3.11.0` | First-class i18n for Next.js App Router          |

**Supported Locales:**

| Locale Code | Language   | Script     | Font Required         |
|-------------|------------|------------|-----------------------|
| `en`        | English    | Latin      | Noto Sans             |
| `hi`        | Hindi      | Devanagari | Noto Sans Devanagari  |
| `bn`        | Bengali    | Bengali    | Noto Sans Bengali     |
| `mr`        | Marathi    | Devanagari | Noto Sans Devanagari  |
| `te`        | Telugu     | Telugu     | Noto Sans Telugu      |
| `ta`        | Tamil      | Tamil      | Noto Sans Tamil       |
| `gu`        | Gujarati   | Gujarati   | Noto Sans Gujarati    |
| `pa`        | Punjabi    | Gurmukhi   | Noto Sans Gurmukhi    |
| `kn`        | Kannada    | Kannada    | Noto Sans Kannada     |

### 2.4 PWA & Offline

| Technology    | Version   | Purpose                                          |
|---------------|-----------|--------------------------------------------------|
| **Serwist**   | `^9.0.0`  | Next.js-compatible service worker library (successor to next-pwa) |

### 2.5 Camera & Image Processing

| Technology                      | Version   | Purpose                              |
|---------------------------------|-----------|--------------------------------------|
| **react-webcam**                | `^7.2.0`  | Camera access via `getUserMedia`     |
| **browser-image-compression**   | `^2.0.2`  | Client-side image compression        |

### 2.6 Supabase Client

| Technology             | Version   | Purpose                                |
|------------------------|-----------|----------------------------------------|
| **@supabase/supabase-js** | `^2.42.0` | Supabase client (auth, DB, storage) |
| **@supabase/ssr**      | `^0.1.0`  | Server-side Supabase helpers for Next.js |

### 2.7 UI Utilities

| Technology       | Version    | Purpose                                     |
|------------------|------------|---------------------------------------------|
| **lucide-react** | `^0.356.0`| Icon library (tree-shakeable SVG icons)      |
| **sonner**       | `^1.4.0`  | Toast notifications                          |
| **framer-motion**| `^11.0.0` | Animations (page transitions, card reveals)  |

### 2.8 Dev Dependencies

| Technology              | Version     | Purpose                              |
|-------------------------|-------------|--------------------------------------|
| **eslint**              | `^8`        | Code linting                         |
| **eslint-config-next**  | `14.2.7`    | Next.js ESLint config                |
| **@types/node**         | `^20`       | Node.js type definitions             |
| **@types/react**        | `^18`       | React type definitions               |
| **@types/react-dom**    | `^18`       | React DOM type definitions           |

---

## 3. Backend & AI Stack

### 3.1 Deployment Target: Railway

| Config        | Value                                     |
|---------------|-------------------------------------------|
| **Runtime**   | Python 3.11+ (Docker)                     |
| **Region**    | `asia-southeast1` (closest to India)     |
| **Scaling**   | 1–4 instances (auto-scale on CPU > 70%)  |
| **Memory**    | 2 GB per instance (minimum for TF model) |
| **Disk**      | 5 GB (model weights + temp uploads)      |

### 3.2 API Framework

| Technology    | Version    | Purpose                                     |
|---------------|------------|---------------------------------------------|
| **FastAPI**   | `^0.110.0`| High-performance Python API framework        |
| **Uvicorn**   | `^0.29.0` | ASGI server                                  |
| **Pydantic**  | `^2.6.0`  | Request/response validation                  |
| **python-multipart** | `^0.0.9` | File upload handling               |

### 3.3 AI / ML

| Technology       | Version    | Purpose                                  |
|------------------|------------|------------------------------------------|
| **TensorFlow**   | `^2.16.0` | Deep learning framework                  |
| **Keras**        | (bundled)  | High-level model API                     |
| **Pillow**       | `^10.3.0` | Image preprocessing                      |
| **NumPy**        | `^1.26.0` | Numerical computation                    |

### 3.4 Model Architecture

```
INPUT IMAGE (224 × 224 × 3)
       ↓
┌──────────────────────────────┐
│   MobileNetV2 (Pre-trained)  │  ← Transfer learning base
│   Frozen feature extractor   │
└──────────┬───────────────────┘
           ↓
┌──────────────────────────────┐
│   GlobalAveragePooling2D     │
│   Dropout(0.5)               │
│   Dense(512, relu)           │
│   Dense(N_classes, softmax)  │  ← N_classes = number of supported diseases
└──────────┬───────────────────┘
           ↓
OUTPUT: [disease_id, confidence_score] (top-3)
```

**Current Baseline:** The existing `model.ipynb` uses MobileNetV2 on the "Agricultural-crops" Kaggle dataset for crop classification. For KrishiVision, this model will be **retrained** on a plant disease dataset (e.g., PlantVillage with 38 disease classes across 14 crops) while keeping the same architecture.

### 3.5 Anti-Hallucination RAG Pipeline

> **Note:** This is NOT a traditional RAG with LLM generation. This is a strict **Classification → Database Lookup** pipeline.

```
Image arrives at Railway API
       ↓
1. Preprocess: resize to 224×224, normalize to [0, 1]
       ↓
2. Inference: model.predict(image) → top-3 [(disease_id, score), ...]
       ↓
3. Confidence Gate:
   ├── score ≥ 0.60 → PROCEED
   └── score < 0.60 → RETURN low_confidence response
       ↓
4. Database Lookup (Supabase REST API):
   SELECT * FROM verified_remedies
   WHERE disease_id = :disease_id
   AND language = :user_locale
       ↓
5. Return structured response:
   {
     "disease_name": "Early Blight",
     "disease_name_localized": "अगेती अंगमारी",
     "confidence": 0.87,
     "crop": "Tomato",
     "remedy": {
       "treatment": "...",
       "organic_alternative": "...",
       "prevention": "..."
     }
   }
```

### 3.6 Railway Services

| Service Name         | Purpose                 | Scaling                          |
|----------------------|-------------------------|----------------------------------|
| `krishi-ai-api`      | Main inference API      | Auto-scale 1–4 instances        |
| `krishi-ai-worker`   | (Future) Batch processing| Manual scale, cron-triggered    |

---

## 4. Database Stack

### 4.1 Supabase Project Configuration

| Config                | Value                                      |
|-----------------------|--------------------------------------------|
| **Region**            | `ap-south-1` (Mumbai)                      |
| **Plan**              | Pro (for connection pooling + 8GB RAM)     |
| **PostgreSQL Version**| 15.x                                      |
| **Connection Pooler** | Supavisor (Transaction mode)               |

### 4.2 PostgreSQL Schema Approach

- All tables use **UUID** primary keys (`gen_random_uuid()`)
- All tables include `created_at` and `updated_at` timestamps
- **Row Level Security (RLS)** enabled on every table
- Foreign keys enforce referential integrity
- Indexes on frequently queried columns (`user_id`, `disease_id`, `language`)

### 4.3 Key Tables (Summary)

| Table                | Purpose                                  | RLS Policy                     |
|----------------------|------------------------------------------|--------------------------------|
| `users`              | User profiles (phone, name, locale)      | Users can read/update own row  |
| `scans`              | Scan history (image_url, result, score)  | Users can read/insert own rows |
| `verified_remedies`  | Expert-curated remedies per disease+lang | Public read, admin write only  |
| `diseases`           | Disease master list (name, crop, model_id)| Public read, admin write only |
| `marketplace_items`  | Product listings                         | Users CRUD own; all can read   |
| `marketplace_images` | Images for marketplace listings          | Linked to marketplace_items    |

### 4.4 Supabase Storage

| Bucket Name          | Purpose                | Access         | Max File Size |
|----------------------|------------------------|----------------|---------------|
| `scan-images`        | Uploaded plant photos  | Authenticated  | 5 MB          |
| `marketplace-images` | Listing product photos | Authenticated  | 5 MB          |
| `avatars`            | User profile pictures  | Authenticated  | 2 MB          |

### 4.5 Supabase Realtime (Phase 5+)

- Real-time subscriptions on `marketplace_items` for live feed updates
- Future: Real-time chat between buyer and seller

---

## 5. DevOps & Deployments

### 5.1 Environment Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        PRODUCTION                                 │
│                                                                   │
│   ┌────────────┐     ┌────────────┐     ┌────────────┐          │
│   │  Vercel    │     │  Railway   │     │  Supabase  │          │
│   │  (Frontend)│     │  (AI API)  │     │  (DB+Auth) │          │
│   │            │     │            │     │            │          │
│   │  Region:   │     │  Region:   │     │  Region:   │          │
│   │  Mumbai    │     │  Singapore │     │  Mumbai    │          │
│   └────────────┘     └────────────┘     └────────────┘          │
│                                                                   │
│   Domain: krishivision.app                                       │
│   AI API: api.krishivision.app (Railway custom domain)           │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        STAGING / PREVIEW                          │
│                                                                   │
│   Vercel Preview Deployments (per PR)                            │
│   Railway staging environment                                    │
│   Supabase staging project (separate)                            │
└──────────────────────────────────────────────────────────────────┘
```

### 5.2 Vercel Configuration

| Config               | Value                                      |
|----------------------|--------------------------------------------|
| **Framework**        | Next.js                                    |
| **Root Directory**   | `web/`                                     |
| **Build Command**    | `npm run build`                            |
| **Output Directory** | `.next`                                    |
| **Node.js Version**  | 20.x                                       |
| **Region**           | `bom1` (Mumbai)                            |

### 5.3 Railway Configuration

| Config               | Value                                      |
|----------------------|--------------------------------------------|
| **Root Directory**   | `ai-service/`                              |
| **Dockerfile**       | `ai-service/Dockerfile`                    |
| **Start Command**    | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Health Check**     | `GET /health`                              |
| **Region**           | `asia-southeast1`                          |

### 5.4 CI/CD Pipeline

```
Developer pushes to GitHub
       ↓
┌──────────────────────────────────┐
│  GitHub Actions CI               │
│  1. Lint (ESLint)                │
│  2. Type check (tsc --noEmit)    │
│  3. Unit tests (Vitest)          │
│  4. Build verification           │
└──────────┬───────────────────────┘
           ↓
┌──────────────────────────────────┐
│  Auto-Deploy                     │
│  • main → Vercel Production      │
│  • main → Railway Production     │
│  • PR   → Vercel Preview         │
└──────────────────────────────────┘
```

---

## 6. Environment Variables

### 6.1 Frontend (Vercel / `.env.local`)

| Variable                              | Description                           | Example                                    |
|---------------------------------------|---------------------------------------|--------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`            | Supabase project URL                  | `https://xxxx.supabase.co`                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`       | Supabase anonymous (public) API key   | `eyJhbGciOiJIUzI1NiIs...`                |
| `NEXT_PUBLIC_AI_API_URL`              | Railway AI service base URL           | `https://api.krishivision.app`            |
| `NEXT_PUBLIC_DEFAULT_LOCALE`          | Default language locale               | `hi`                                      |
| `NEXT_PUBLIC_APP_URL`                 | Public app URL                        | `https://krishivision.app`                |

### 6.2 Backend / AI Service (Railway)

| Variable                              | Description                           | Example                                    |
|---------------------------------------|---------------------------------------|--------------------------------------------|
| `SUPABASE_URL`                        | Supabase project URL                  | `https://xxxx.supabase.co`                |
| `SUPABASE_SERVICE_ROLE_KEY`           | Supabase service role key (admin)     | `eyJhbGciOiJIUzI1NiIs...`                |
| `MODEL_PATH`                          | Path to trained `.keras` model file   | `/app/models/best_model.keras`            |
| `CONFIDENCE_THRESHOLD`               | Minimum confidence for valid diagnosis| `0.60`                                    |
| `MAX_IMAGE_SIZE_MB`                   | Maximum upload size                   | `5`                                       |
| `PORT`                                | Server port (Railway-injected)        | `8080`                                    |
| `RAILWAY_ENVIRONMENT`                 | Environment name                      | `production`                               |
| `CORS_ORIGINS`                        | Allowed CORS origins                  | `https://krishivision.app`                |

### 6.3 Supabase (Dashboard Configuration)

| Setting                               | Value                                 |
|---------------------------------------|---------------------------------------|
| **Site URL**                          | `https://krishivision.app`            |
| **Redirect URLs**                     | `https://krishivision.app/**`         |
| **JWT Expiry**                        | `604800` (7 days)                     |
| **Phone Auth Provider**              | Enabled (Twilio or MessageBird)       |
| **SMS OTP Template**                 | `Your KrishiVision code is: {code}`   |

---

## 7. Package.json Scripts

### 7.1 Frontend (`web/package.json`)

```json
{
  "name": "krishivision-web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "format": "prettier --write .",
    "analyze": "ANALYZE=true next build",
    "postbuild": "next-sitemap"
  }
}
```

### 7.2 AI Service (`ai-service/requirements.txt`)

```
fastapi==0.110.0
uvicorn[standard]==0.29.0
tensorflow==2.16.1
Pillow==10.3.0
numpy==1.26.4
pydantic==2.6.4
python-multipart==0.0.9
supabase==2.4.0
python-dotenv==1.0.1
```

---

## 8. Language Support Strategy

### 8.1 Architecture

```
web/
├── messages/                    ← Translation JSON files
│   ├── en.json                  ← English (default fallback)
│   ├── hi.json                  ← Hindi
│   ├── bn.json                  ← Bengali
│   ├── mr.json                  ← Marathi
│   ├── te.json                  ← Telugu
│   ├── ta.json                  ← Tamil
│   ├── gu.json                  ← Gujarati
│   ├── pa.json                  ← Punjabi
│   └── kn.json                  ← Kannada
├── i18n.ts                      ← next-intl configuration
└── middleware.ts                ← Locale detection middleware
```

### 8.2 Translation File Structure

```json
{
  "common": {
    "appName": "KrishiVision",
    "home": "होम",
    "scan": "स्कैन करें",
    "marketplace": "मार्केट",
    "profile": "प्रोफ़ाइल",
    "submit": "जमा करें",
    "cancel": "रद्द करें",
    "retry": "पुनः प्रयास करें",
    "loading": "लोड हो रहा है..."
  },
  "scan": {
    "title": "पौधे का फ़ोटो लें",
    "analyzing": "विश्लेषण हो रहा है...",
    "retake": "पुनः लें",
    "result": "परिणाम",
    "confidence": "विश्वसनीयता",
    "lowConfidence": "हम निश्चित नहीं हैं। कृपया विशेषज्ञ से संपर्क करें।"
  },
  "remedy": {
    "title": "उपचार",
    "treatment": "उपचार विधि",
    "organic": "जैविक विकल्प",
    "prevention": "रोकथाम"
  },
  "marketplace": {
    "title": "कृषि मार्केट",
    "addListing": "नई लिस्टिंग",
    "contactSeller": "विक्रेता से संपर्क",
    "price": "कीमत",
    "category": "श्रेणी"
  }
}
```

### 8.3 Locale Detection Flow

```
1. Check URL path prefix (/hi, /en, /bn, etc.)
       ↓
2. If none → Check localStorage('preferred-locale')
       ↓
3. If none → Check Accept-Language header
       ↓
4. If none → Default to 'hi' (Hindi — largest user base)
       ↓
5. Set locale in middleware → Rewrite URL
```

### 8.4 Remedy Translations Strategy

> UI strings are stored in JSON files (client-side). **Remedy content** is stored in the `verified_remedies` Supabase table with a `language` column, fetched server-side.

```
┌──────────────────────────────────────────────────────────────┐
│  verified_remedies table                                      │
│                                                               │
│  disease_id │ language │ treatment      │ organic_alt │ ...   │
│  ───────────┼──────────┼────────────────┼─────────────┼─────  │
│  early_blight│ hi       │ मैंकोज़ेब 2.5g...│ नीम तेल... │       │
│  early_blight│ en       │ Mancozeb 2.5g...│ Neem oil...│       │
│  early_blight│ te       │ మాంకోజెబ్ 2.5g...│ వేప నూనె...│       │
└──────────────────────────────────────────────────────────────┘
```

### 8.5 Font Loading Strategy

```typescript
// next.config.mjs — Optimized font loading
import { Noto_Sans, Noto_Sans_Devanagari } from 'next/font/google';

// Latin (English)
const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
});

// Devanagari (Hindi, Marathi)
const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-noto-devanagari',
  display: 'swap',
});

// Additional fonts loaded conditionally per locale
// Bengali, Telugu, Tamil, Gujarati, Gurmukhi, Kannada
// Use next/font/google with display: 'swap' for all
```

---

*End of Technology Stack Documentation — KrishiVision v1.0.0*
