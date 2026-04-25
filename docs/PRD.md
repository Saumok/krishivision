# KrishiVision — Product Requirements Document (PRD)

---

## 1. Product Overview

| Field        | Value                                                                 |
|--------------|-----------------------------------------------------------------------|
| **Title**    | KrishiVision — AI-Powered Crop Disease Diagnosis & Farmer Marketplace |
| **Version**  | 1.0.0 (MVP)                                                          |
| **Owner**    | KrishiVision Core Team                                                |
| **Platform** | Progressive Web App (PWA) — Mobile-first, cross-platform              |
| **Updated**  | 2026-04-25                                                            |

KrishiVision is a mobile-first PWA that empowers Indian farmers to instantly diagnose plant diseases by scanning a photo of their crop, receive **verified, hallucination-free remedies**, and access a peer-to-peer marketplace for buying and selling agricultural equipment and produce.

---

## 2. Problem Statement

Indian agriculture suffers from two critical, interconnected problems:

### 2.1 Crop Loss from Unidentified Diseases
- **₹50,000+ crore** in annual crop losses are attributed to plant diseases in India.
- Farmers lack immediate access to agricultural scientists or extension officers.
- Misidentification of diseases leads to incorrect pesticide use, further damaging crops and soil.
- Existing solutions require high literacy, expensive smartphones, or stable internet — none of which are guaranteed in rural India.

### 2.2 Lack of Market Access for Equipment & Surplus
- Small and marginal farmers (86% of Indian farmers) cannot afford new equipment.
- There is no simple, localized digital marketplace for **used agricultural tools**, tractors, pumps, seeds, or organic fertilizers.
- Middlemen capture 30–60% of value; direct farmer-to-farmer transactions are almost nonexistent digitally.

---

## 3. Goals & Objectives

| # | Goal                          | Objective                                                          | Timeline  |
|---|-------------------------------|--------------------------------------------------------------------|-----------|
| 1 | **Precision AI Diagnosis**    | Achieve ≥90% top-3 accuracy on supported crop diseases at launch   | Phase 3   |
| 2 | **Zero AI Hallucination**     | 100% of remedies sourced from verified database; no generative text | All       |
| 3 | **Financial Empowerment**     | Enable ₹1 crore+ in marketplace GMV within 6 months of launch      | Phase 4+  |
| 4 | **Radical Accessibility**     | Usable by a farmer who has never used an app before                 | Phase 2   |
| 5 | **Multilingual from Day 1**   | Support ≥8 Indian languages at launch                               | Phase 2   |
| 6 | **Low Bandwidth Performance** | Full scan flow works on 2G/3G networks (< 500 KB upload)           | Phase 5   |

---

## 4. Success Metrics

| Metric                         | Target (6-month)          | Measurement Method                         |
|--------------------------------|---------------------------|--------------------------------------------|
| **Scan Accuracy (Top-3)**      | ≥ 90%                    | Model eval on curated test set             |
| **Anti-Hallucination Rate**    | 100% (zero hallucinations)| Automated audit: every response checked against `verified_remedies` DB |
| **Daily Active Users (DAU)**   | 10,000+                  | Supabase Analytics / PostHog               |
| **Scan-to-Remedy Completion**  | ≥ 80% of scans           | Funnel analytics                           |
| **Marketplace Listings/Month** | 500+                     | DB query on `marketplace_items`            |
| **Marketplace Transactions**   | 100+ / month             | Contact-initiated tracking                 |
| **App Load Time (3G)**         | < 3 seconds              | Lighthouse / WebPageTest                   |
| **Language Adoption**          | ≥ 40% non-English users  | Locale selection analytics                 |
| **User Retention (D7)**        | ≥ 30%                    | Cohort analysis                            |

---

## 5. Target Users & Personas

### Persona 1: Ramesh — The Small Farmer
| Attribute           | Detail                                              |
|---------------------|-----------------------------------------------------|
| **Age**             | 35–55                                               |
| **Location**        | Rural Maharashtra / UP / Bihar                      |
| **Landholding**     | 1–3 acres                                           |
| **Phone**           | Android (entry-level, ₹5,000–8,000 device)          |
| **Tech Proficiency**| Very Low — uses WhatsApp and YouTube only            |
| **Language**        | Hindi / Marathi (cannot read English)                |
| **Pain Point**      | Yellowing leaves on his tomato crop; nearest agri officer is 40 km away |
| **Behavior**        | Will try the app ONLY if it works in his language and requires zero typing |

### Persona 2: Lakshmi — The Progressive Farmer
| Attribute           | Detail                                              |
|---------------------|-----------------------------------------------------|
| **Age**             | 28–40                                               |
| **Location**        | Semi-urban Andhra Pradesh / Tamil Nadu               |
| **Landholding**     | 3–8 acres                                           |
| **Phone**           | Mid-range Android                                   |
| **Tech Proficiency**| Moderate — uses farming apps, reads news on phone    |
| **Language**        | Telugu / Tamil / English                             |
| **Pain Point**      | Wants to sell her old rotary tiller and buy a newer mini tractor |
| **Behavior**        | Will list items if the process takes < 2 minutes     |

### Persona 3: Arjun — The Agri-Input Dealer
| Attribute           | Detail                                              |
|---------------------|-----------------------------------------------------|
| **Age**             | 30–50                                               |
| **Location**        | Small-town India                                    |
| **Phone**           | Good Android / basic desktop                        |
| **Tech Proficiency**| Moderate                                            |
| **Pain Point**      | Wants to list surplus seeds, fertilizers, and used equipment for direct sale |
| **Behavior**        | Will use marketplace if he sees traction from farmers |

---

## 6. Features & Requirements

### P0 — Must-Have (MVP Launch)

#### 6.1 Multilingual UI (i18n)
**Description:** The entire application interface, including labels, buttons, diagnosis results, and remedies, must render in the user's selected language.

| ID       | Acceptance Criteria                                                                     |
|----------|-----------------------------------------------------------------------------------------|
| `i18n-1` | Language selection screen is the **first** screen on onboarding (before OTP login).      |
| `i18n-2` | Supported languages at launch: English, Hindi (हिन्दी), Bengali (বাংলা), Marathi (मराठी), Telugu (తెలుగు), Tamil (தமிழ்), Gujarati (ગુજરાતી), Punjabi (ਪੰਜਾਬੀ), Kannada (ಕನ್ನಡ). |
| `i18n-3` | Language can be changed anytime from Profile/Settings without logging out.                |
| `i18n-4` | All remedy text in `verified_remedies` table is stored per-language.                     |
| `i18n-5` | Fonts used must render all Indic scripts correctly (Noto Sans recommended).              |

#### 6.2 Camera/Upload Scanner
**Description:** Users can capture a photo of a diseased plant using their device camera or upload an existing image from gallery.

| ID        | Acceptance Criteria                                                                    |
|-----------|----------------------------------------------------------------------------------------|
| `scan-1`  | Camera opens via `getUserMedia` API; large, centered shutter button (≥ 64px tap target).|
| `scan-2`  | Gallery upload supported as fallback (file input accepting `.jpg`, `.png`, `.webp`).    |
| `scan-3`  | Image is compressed client-side to ≤ 500 KB before upload (use `canvas` or `browser-image-compression`). |
| `scan-4`  | Upload progress indicator shown during submission.                                      |
| `scan-5`  | Graceful error if camera permission is denied (text + icon explaining how to enable).   |
| `scan-6`  | Image preview shown before submission with "Retake" and "Submit" buttons.               |

#### 6.3 AI Diagnosis Engine
**Description:** The uploaded image is sent to the AI backend (Railway), which returns a disease classification with confidence score.

| ID        | Acceptance Criteria                                                                    |
|-----------|----------------------------------------------------------------------------------------|
| `diag-1`  | AI model returns top-3 predictions with confidence percentages.                         |
| `diag-2`  | If highest confidence < 60%, display: "We are not sure. Please consult an expert." with expert contact option. |
| `diag-3`  | Response time ≤ 5 seconds on 3G network (backend + round-trip).                        |
| `diag-4`  | Model is based on MobileNetV2 (transfer learning), trained on verified agricultural datasets. |
| `diag-5`  | Diagnosis result card shows: disease name (localized), confidence %, affected crop name. |

#### 6.4 Verified Remedy Database
**Description:** Each diagnosed disease maps to a curated, human-verified remedy stored in the `verified_remedies` table.

| ID         | Acceptance Criteria                                                                   |
|------------|----------------------------------------------------------------------------------------|
| `remedy-1` | Remedies are pre-written by agricultural experts and stored in Supabase.               |
| `remedy-2` | Each remedy includes: recommended treatment, organic alternatives, prevention tips.    |
| `remedy-3` | Remedy text is available in all supported languages.                                   |
| `remedy-4` | If no remedy exists for a detected disease, show: "Remedy not yet available. Connecting you to an expert." |
| `remedy-5` | No LLM-generated text is shown to the user. All text comes from the database verbatim. |

---

### P1 — High Priority (Post-MVP, Phase 4)

#### 6.5 Marketplace Listings
**Description:** Farmers can list agricultural equipment, tools, seeds, and produce for sale.

| ID          | Acceptance Criteria                                                                  |
|-------------|--------------------------------------------------------------------------------------|
| `mktpl-1`   | Create listing flow: Photo(s) → Title → Price → Category → Location → Publish.      |
| `mktpl-2`   | Browse marketplace with category filters (Equipment, Seeds, Fertilizer, Other).      |
| `mktpl-3`   | Listings show: image, title, price, location, seller rating, post date.              |
| `mktpl-4`   | Listings are stored in Supabase `marketplace_items` table with Row Level Security.   |
| `mktpl-5`   | Sellers can edit/delete their own listings only.                                      |

#### 6.6 Buyer–Seller Contact
**Description:** Interested buyers can contact sellers directly.

| ID           | Acceptance Criteria                                                                 |
|--------------|--------------------------------------------------------------------------------------|
| `contact-1`  | "Contact Seller" button reveals seller's phone number (with consent).                |
| `contact-2`  | Optional: In-app chat using Supabase Realtime (Phase 5+).                            |
| `contact-3`  | Contact action is logged for analytics (marketplace engagement tracking).            |

---

### P2 — Nice to Have (Future)

| Feature                  | Description                                               |
|--------------------------|-----------------------------------------------------------|
| Community Forum          | Farmer-to-farmer Q&A on crop issues                      |
| Weather Integration      | Localized weather alerts tied to disease risk             |
| Government Scheme Alerts | Notifications about relevant subsidy programs             |
| Voice Input              | Voice-based disease description for illiterate users      |
| Scan History Dashboard   | Visual timeline of past scans and crop health             |

---

## 7. Strict Anti-Hallucination Rules

> **CRITICAL DESIGN PRINCIPLE:** KrishiVision provides zero generative AI text to users. Every word shown as a "remedy" or "diagnosis explanation" is human-verified and database-sourced.

### 7.1 Architecture-Level Guardrails

| Rule | Implementation |
|------|----------------|
| **No LLM for Remedies** | The AI model performs classification ONLY. It outputs a `disease_id` + `confidence_score`. It does NOT generate text. |
| **Verified Remedy Lookup** | The `disease_id` is used as a foreign key to fetch the matching row from `verified_remedies` table. This is a simple database query, not AI generation. |
| **Confidence Gating** | If `confidence_score < 0.60`, the system does NOT display any remedy. Instead, it shows a "consult an expert" message. |
| **Unknown Disease Fallback** | If the `disease_id` has no matching entry in `verified_remedies`, display: "This condition is not yet in our database. We are connecting you with a human expert." |
| **Human Expert Escalation** | Every failed or uncertain diagnosis offers a one-tap path to a verified agricultural expert (phone/WhatsApp). |
| **Audit Trail** | Every scan, prediction, remedy shown, and expert escalation is logged in the `scans` table for periodic human audit. |

### 7.2 Content Pipeline

```
Farmer snaps photo
       ↓
Image compressed & uploaded to Supabase Storage
       ↓
Railway AI Microservice receives image
       ↓
MobileNetV2 model classifies → disease_id + confidence_score
       ↓
IF confidence ≥ 0.60:
    → Query verified_remedies WHERE disease_id = X AND language = user_locale
    → Display remedy card (database text only)
ELSE:
    → Display "low confidence" card + expert contact
       ↓
Entire interaction logged in scans table
```

---

## 8. Explicitly OUT OF SCOPE (V1)

| Feature / Capability                  | Reason                                                       |
|---------------------------------------|--------------------------------------------------------------|
| **In-app Payment Gateway**            | Regulatory complexity; V1 uses direct seller contact only    |
| **Drone / Satellite Integration**     | Requires hardware partnerships; future roadmap               |
| **Chatbot / Conversational AI**       | Risk of hallucination; contradicts anti-hallucination mandate |
| **Real-time Video Diagnosis**         | Bandwidth-prohibitive for target users                       |
| **Pest Detection (insects/animals)**  | Model trained on plant diseases only in V1                   |
| **Yield Prediction**                  | Requires multi-season data not yet available                 |
| **iOS Native App**                    | PWA covers iOS Safari; native app deferred to V2             |
| **Complex User Roles (Admin Panel)**  | Manual moderation via Supabase Studio in V1                  |
| **Social Features (likes, comments)** | Adds complexity without solving core problem                 |
| **Logistics / Delivery**             | Out of scope; marketplace is listing + contact only          |

---

## 9. User Scenarios

### Scenario 1: Scanning a Diseased Leaf

**Actor:** Ramesh (small farmer, Hindi-speaking, 2G connection)

| Step | Action                                                                                   |
|------|------------------------------------------------------------------------------------------|
| 1    | Ramesh opens KrishiVision from his home screen (PWA icon).                               |
| 2    | App loads in Hindi (his previously selected language).                                    |
| 3    | He taps the large green **📷 स्कैन करें** (Scan) button on the home screen.                  |
| 4    | Camera opens with a simple viewfinder. He points at the yellowing tomato leaf.           |
| 5    | He taps the large circular shutter button. A preview appears.                            |
| 6    | He taps **जमा करें** (Submit). A progress spinner appears: "विश्लेषण हो रहा है..." (Analyzing...). |
| 7    | After 4 seconds, a **Diagnosis Card** appears:                                           |
|      | — Disease: **अगेती अंगमारी (Early Blight)** — Confidence: **87%**                        |
|      | — Crop: टमाटर (Tomato)                                                                   |
| 8    | Below the card, the **Verified Remedy** section shows:                                   |
|      | — **उपचार:** मैंकोज़ेब 2.5 ग्राम/लीटर पानी में घोलकर छिड़काव करें।                           |
|      | — **जैविक विकल्प:** नीम तेल 5 मिली/लीटर पानी में मिलाकर...                                   |
|      | — **रोकथाम:** फसल चक्र अपनाएं, संक्रमित पत्तियां हटाएं।                                    |
| 9    | Ramesh follows the remedy. He can tap **📜 इतिहास** to see this scan later.                |

### Scenario 2: Listing a Used Tractor Part

**Actor:** Lakshmi (progressive farmer, Telugu-speaking)

| Step | Action                                                                                   |
|------|------------------------------------------------------------------------------------------|
| 1    | Lakshmi taps the **🏪 మార్కెట్** (Marketplace) tab in the bottom navigation.                |
| 2    | She sees recent listings from nearby farmers with photos, prices, and locations.          |
| 3    | She taps **➕ జాబితా జోడించు** (Add Listing).                                               |
| 4    | She takes 2 photos of her old rotary tiller using the camera.                            |
| 5    | She types (or voice-inputs): Title: "రోటరీ టిల్లర్", Price: "₹15,000", Category: "Equipment". |
| 6    | She taps **ప్రచురించు** (Publish). The listing appears in the marketplace feed immediately. |
| 7    | A buyer (Arjun) sees the listing, taps **📞 సంప్రదించండి** (Contact Seller).                |
| 8    | Lakshmi's phone number is revealed. Arjun calls her to negotiate.                        |

---

## 10. Non-Functional Requirements

### 10.1 Performance

| Requirement                    | Target                                                  |
|--------------------------------|---------------------------------------------------------|
| **First Contentful Paint**     | < 1.5 seconds on 4G, < 3 seconds on 3G                 |
| **Time to Interactive**        | < 3 seconds on 4G                                       |
| **Image Upload Size**          | ≤ 500 KB after client-side compression                  |
| **AI Response Time**           | ≤ 5 seconds (including network round-trip on 3G)        |
| **Offline Support**            | Home screen, last 5 scan results, and marketplace browse available offline via service worker |
| **Bundle Size**                | < 200 KB initial JS bundle (gzipped)                    |

### 10.2 Reliability & Availability

| Requirement                    | Target                                                  |
|--------------------------------|---------------------------------------------------------|
| **Uptime**                     | 99.5% (Vercel + Railway SLA)                            |
| **Error Recovery**             | Auto-retry failed image uploads (up to 3 attempts)      |
| **Data Durability**            | Supabase PostgreSQL with daily backups                   |

### 10.3 Security

| Requirement                    | Target                                                  |
|--------------------------------|---------------------------------------------------------|
| **Authentication**             | Supabase Phone OTP (no passwords to remember)           |
| **Data Encryption**            | TLS 1.3 in transit, AES-256 at rest (Supabase default)  |
| **Row Level Security**         | Enabled on all Supabase tables                           |
| **Image Storage**              | Private Supabase Storage buckets with signed URLs        |

### 10.4 Scalability

| Requirement                    | Target                                                  |
|--------------------------------|---------------------------------------------------------|
| **Concurrent Users**           | Handle 1,000 concurrent scans                            |
| **Database**                   | Supabase Pro tier (8 GB RAM, connection pooling)         |
| **AI Backend**                 | Railway auto-scaling (1–4 instances based on load)       |

### 10.5 Localization

| Requirement                    | Target                                                  |
|--------------------------------|---------------------------------------------------------|
| **RTL Support**                | Not required for V1 (no Urdu/Arabic)                    |
| **Number Formatting**          | Indian numbering system (₹1,00,000 instead of ₹100,000)|
| **Date Formatting**            | DD/MM/YYYY (Indian standard)                            |
| **Currency**                   | INR (₹) only in V1                                      |

---

*End of PRD — KrishiVision v1.0.0*
