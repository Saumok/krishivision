# KrishiVision — Application Flow Documentation

---

## 1. Entry Points

Users can access KrishiVision through three primary channels:

| Entry Point               | URL / Mechanism                              | Context                                                    |
|---------------------------|----------------------------------------------|------------------------------------------------------------|
| **Direct Web (Browser)**  | `https://krishivision.app`                   | Users type URL or follow a link from search/social media.  |
| **PWA App Icon**          | Home screen icon (after "Add to Home Screen")| Primary repeat-use entry. Launches in standalone mode.     |
| **WhatsApp / SMS Links**  | `https://krishivision.app/scan?ref=whatsapp` | Shared by extension officers, farmer groups, or friends.   |
| **QR Code (Physical)**    | Printed on posters in Krishi Vigyan Kendras  | Scanned at agricultural offices, melas, or shops.          |

### Entry Point Behavior

```
User taps entry point
       ↓
Is this the first visit?
  ├── YES → Onboarding Flow (Section 2)
  └── NO  → Home Screen (with language already set)
```

---

## 2. Onboarding Flow

> **Design Principle:** Language selection comes BEFORE authentication. A farmer must be able to understand the UI before being asked to provide a phone number.

### 2.1 Flow Diagram

```
┌──────────────────────────┐
│   SPLASH SCREEN (1.5s)   │
│   KrishiVision logo      │
│   "कृषि विज़न" tagline    │
└──────────┬───────────────┘
           ↓
┌──────────────────────────┐
│   LANGUAGE SELECTION     │
│                          │
│   🇮🇳 हिन्दी    🇮🇳 English │
│   🇮🇳 বাংলা     🇮🇳 मराठी   │
│   🇮🇳 తెలుగు    🇮🇳 தமிழ்   │
│   🇮🇳 ગુજરાતી   🇮🇳 ਪੰਜਾਬੀ  │
│   🇮🇳 ಕನ್ನಡ                │
│                          │
│   [Large tap targets]    │
└──────────┬───────────────┘
           ↓
┌──────────────────────────┐
│   PHONE NUMBER INPUT     │
│                          │
│   +91 [__________]       │
│                          │
│   [ OTP भेजें / Send OTP ]│
│   (Large green button)   │
└──────────┬───────────────┘
           ↓
┌──────────────────────────┐
│   OTP VERIFICATION       │
│                          │
│   [_] [_] [_] [_] [_] [_]│
│                          │
│   [ सत्यापित करें / Verify]│
│   "Resend in 30s"        │
└──────────┬───────────────┘
           ↓
┌──────────────────────────┐
│   WELCOME / HOME SCREEN  │
│   (User is authenticated)│
└──────────────────────────┘
```

### 2.2 Onboarding States

| State              | Trigger                           | Behavior                                                        |
|--------------------|-----------------------------------|-----------------------------------------------------------------|
| **Splash**         | App opened                        | Logo + tagline (1.5s). Auto-advance.                           |
| **Language Select** | First visit OR no locale in `localStorage` | Grid of language buttons. Tap = set locale + advance.   |
| **Phone Input**    | Language selected                  | Numeric keyboard auto-opens. `+91` pre-filled.                 |
| **OTP Sent**       | Valid 10-digit number submitted    | Supabase `signInWithOtp()` called. Timer starts (30s).         |
| **OTP Verified**   | Correct 6-digit OTP entered        | Supabase session created. Redirect to Home.                    |
| **OTP Failed**     | Wrong OTP 3 times                  | "कृपया पुनः प्रयास करें" with option to re-enter phone number.   |
| **Already Logged In**| Valid Supabase session exists     | Skip onboarding entirely. Go to Home.                          |

---

## 3. Core User Flows

### 3.1 Flow 1: Scan & Diagnose

This is the **primary user journey** — a farmer scans a diseased plant and receives a verified cure.

#### Happy Path

```
HOME SCREEN
  ↓ Tap "📷 स्कैन करें" (Scan Button)
  ↓
CAMERA SCREEN
  ↓ Point at plant → Tap shutter
  ↓
IMAGE PREVIEW
  ↓ "Does this look correct?"
  ├── [🔄 पुनः लें / Retake] → Back to Camera
  └── [✅ जमा करें / Submit] → Continue
  ↓
UPLOADING STATE
  ↓ Progress bar (image → Supabase Storage → Railway AI)
  ↓ Text: "विश्लेषण हो रहा है..." (Analyzing...)
  ↓
DIAGNOSIS RESULT
  ↓ Disease Card:
  │   • Disease Name (localized)
  │   • Confidence: 87%
  │   • Crop: Tomato (टमाटर)
  │
  ↓ Remedy Card (from verified_remedies DB):
  │   • 💊 Treatment
  │   • 🌿 Organic Alternative
  │   • 🛡️ Prevention Tips
  │
  ↓ Actions:
      [📜 इतिहास में सेव / Save to History]
      [📤 शेयर / Share via WhatsApp]
      [🔄 नया स्कैन / New Scan]
```

#### Error States

| Error                             | Screen Behavior                                                                  |
|-----------------------------------|----------------------------------------------------------------------------------|
| **Camera Permission Denied**      | Full-screen card with phone settings icon + step-by-step instructions to enable camera. Fallback: "📁 गैलरी से अपलोड करें" (Upload from Gallery) button. |
| **Poor Internet Connection**      | Upload retries 3× automatically. After 3 failures: "इंटरनेट कनेक्शन धीमा है। कृपया बाद में पुनः प्रयास करें।" with [Retry] button. Image saved locally for later upload. |
| **AI Service Unavailable**        | "सर्वर व्यस्त है। कृपया 1 मिनट बाद पुनः प्रयास करें।" with auto-retry after 60s. |
| **Low Confidence (< 60%)**        | Yellow warning card: "हम निश्चित नहीं हैं। कृपया विशेषज्ञ से संपर्क करें।" + [📞 विशेषज्ञ से बात करें] button. |
| **No Remedy in Database**         | Orange card: "इस रोग का उपचार अभी उपलब्ध नहीं है। हम विशेषज्ञ से जोड़ रहे हैं।" + expert contact. |
| **Corrupt/Invalid Image**         | "कृपया स्पष्ट फ़ोटो लें।" (Please take a clear photo.) with tips: good lighting, close-up, steady hand. |

#### Edge Cases

| Edge Case                         | Handling                                                                          |
|-----------------------------------|-----------------------------------------------------------------------------------|
| **User uploads non-plant image**  | Model returns low confidence → triggers "consult expert" flow.                   |
| **Multiple diseases visible**     | Top-3 predictions shown; user can tap each for details.                          |
| **Extremely large image**         | Client-side compression to ≤ 500 KB before upload. If still too large, warn user.|
| **User navigates away mid-scan**  | Scan state preserved; resumed on return. If upload in progress, continues in background. |

---

### 3.2 Flow 2: Marketplace Browse & Sell

#### Browse Path (Buyer)

```
HOME SCREEN
  ↓ Tap "🏪 मार्केट" (Marketplace tab)
  ↓
MARKETPLACE FEED
  ↓ Grid of listing cards (image, title, price, location)
  ↓ Category filter tabs: [सभी] [उपकरण] [बीज] [खाद] [अन्य]
  ↓ Search bar (optional text input)
  ↓
LISTING DETAIL PAGE
  ↓ Full-screen image carousel
  ↓ Title, Price (₹), Category, Location, Seller Info
  ↓ [📞 विक्रेता से संपर्क / Contact Seller]
  ↓
CONTACT REVEALED
  ↓ Seller's phone number displayed
  ↓ [📱 कॉल करें] → Opens phone dialer
  ↓ [💬 WhatsApp] → Opens WhatsApp chat
```

#### Sell Path (Seller)

```
MARKETPLACE FEED
  ↓ Tap "➕ नई लिस्टिंग" (Add Listing) FAB
  ↓
ADD LISTING - PHOTO
  ↓ Camera or Gallery (1–4 photos)
  ↓ [आगे बढ़ें / Next]
  ↓
ADD LISTING - DETAILS
  ↓ Title (text input, large font)
  ↓ Price (₹ numeric input)
  ↓ Category (dropdown: Equipment, Seeds, Fertilizer, Other)
  ↓ Location (auto-detect GPS or manual input)
  ↓ [प्रकाशित करें / Publish]
  ↓
SUCCESS CONFIRMATION
  ↓ "आपकी लिस्टिंग प्रकाशित हो गई है!" (Your listing is published!)
  ↓ [लिस्टिंग देखें / View Listing]
```

#### Marketplace Error States

| Error                              | Behavior                                                           |
|------------------------------------|--------------------------------------------------------------------|
| **Image upload fails**             | Retry 3×, then show error with retry button.                      |
| **No listings to show**            | Empty state: "अभी कोई लिस्टिंग नहीं है। पहली लिस्टिंग जोड़ें!" + CTA button. |
| **Listing creation fails**         | Draft saved locally. "इंटरनेट उपलब्ध होने पर पुनः प्रयास करें।"       |
| **Reported/Flagged listing**       | Hidden from feed. Seller notified: "आपकी लिस्टिंग समीक्षा में है।"  |

---

## 4. Navigation Map

### Bottom Tab Bar (3 tabs — maximum simplicity)

```
┌───────────────────────────────────────────────┐
│                                               │
│              [SCREEN CONTENT]                 │
│                                               │
├───────────┬───────────────┬───────────────────┤
│  🏠 होम    │   🏪 मार्केट    │    👤 प्रोफ़ाइल   │
│  Home      │  Marketplace  │    Profile        │
└───────────┴───────────────┴───────────────────┘
```

| Tab           | Icon   | Screens Accessible                                              |
|---------------|--------|-----------------------------------------------------------------|
| **Home/Scan** | 🏠 / 📷 | Home Dashboard, Camera, Image Preview, Diagnosis Result, Scan History |
| **Marketplace** | 🏪    | Marketplace Feed, Listing Detail, Add Listing, My Listings      |
| **Profile**   | 👤     | Profile Settings, Language Change, Scan History, Help/FAQ, Logout |

### Navigation Hierarchy

```
App Root
├── /                     → Home (Scan CTA + Recent Scans)
├── /scan                 → Camera Screen
│   ├── /scan/preview     → Image Preview
│   └── /scan/result/:id  → Diagnosis Result + Remedy
├── /marketplace          → Marketplace Feed
│   ├── /marketplace/:id  → Listing Detail
│   └── /marketplace/new  → Add Listing
├── /profile              → User Profile
│   ├── /profile/language → Language Settings
│   ├── /profile/history  → Full Scan History
│   └── /profile/help     → Help / FAQ
├── /onboarding           → Language → OTP flow
└── /expert               → Expert Contact Page
```

---

## 5. Screen Inventory

| Screen                | URL                    | Auth Required | Key UI Elements                                                    |
|-----------------------|------------------------|---------------|--------------------------------------------------------------------|
| **Splash**            | `/`                    | No            | Logo, tagline, loading indicator                                   |
| **Language Select**   | `/onboarding`          | No            | Grid of 9 language buttons (≥ 56px height each)                   |
| **Phone Input**       | `/onboarding/phone`    | No            | +91 prefix, 10-digit input, "Send OTP" button                     |
| **OTP Verify**        | `/onboarding/otp`      | No            | 6 OTP boxes, "Verify" button, resend timer                        |
| **Home**              | `/`                    | Yes           | Hero scan CTA (large green button), recent scans carousel, tips   |
| **Camera**            | `/scan`                | Yes           | Full-screen viewfinder, shutter button (80px), flash toggle, gallery icon |
| **Image Preview**     | `/scan/preview`        | Yes           | Full image, "Retake" (red), "Submit" (green) — both ≥ 56px height|
| **Uploading**         | `/scan/preview`        | Yes           | Progress bar, animated plant icon, "Analyzing..." text            |
| **Diagnosis Result**  | `/scan/result/:id`     | Yes           | Disease card, confidence badge, remedy accordion, share button    |
| **Marketplace Feed**  | `/marketplace`         | Yes           | Category tabs, search bar, 2-column grid of listing cards         |
| **Listing Detail**    | `/marketplace/:id`     | Yes           | Image carousel, price tag, description, "Contact Seller" CTA     |
| **Add Listing**       | `/marketplace/new`     | Yes           | Photo picker, title/price/category inputs, "Publish" button      |
| **Profile**           | `/profile`             | Yes           | Avatar, name, phone, language selector, scan count, logout        |
| **Scan History**      | `/profile/history`     | Yes           | Chronological list of past scans with thumbnails and results      |
| **Help/FAQ**          | `/profile/help`        | Yes           | Accordion of common questions in selected language                |
| **Expert Contact**    | `/expert`              | Yes           | Expert info card, phone dialer link, WhatsApp deep link           |

### Touch Target Standards

| Element Type    | Minimum Size | Recommended Size | Spacing |
|-----------------|-------------|------------------|---------|
| Primary CTA     | 56px        | 64px             | 16px    |
| Tab Bar Item    | 48px        | 56px             | 0 (edge-to-edge) |
| List Item       | 48px        | 56px             | 8px     |
| Icon Button     | 44px        | 48px             | 12px    |
| Text Link       | 44px        | 48px             | 8px     |

---

## 6. Error Handling Flows

### 6.1 Camera Permission Denied

```
User taps "Scan" button
       ↓
Browser prompts for camera permission
       ↓
User denies permission
       ↓
┌──────────────────────────────────────┐
│  ⚠️ कैमरा एक्सेस आवश्यक है          │
│  (Camera access is required)          │
│                                      │
│  📱 कैमरा चालू करने के लिए:           │
│  1. फ़ोन सेटिंग्स खोलें              │
│  2. ऐप → KrishiVision               │
│  3. कैमरा → अनुमति दें               │
│                                      │
│  --- या ---                           │
│                                      │
│  [📁 गैलरी से फ़ोटो चुनें]            │
│  (Upload from Gallery instead)       │
└──────────────────────────────────────┘
```

### 6.2 Image Upload Failed

```
Upload attempt → Network error
       ↓
Auto-retry (attempt 2 of 3)
       ↓
Auto-retry (attempt 3 of 3)
       ↓
All retries failed
       ↓
┌──────────────────────────────────────┐
│  ❌ अपलोड विफल                       │
│  (Upload failed)                      │
│                                      │
│  इंटरनेट कनेक्शन की जाँच करें        │
│                                      │
│  [🔄 पुनः प्रयास करें]                │
│  [💾 बाद के लिए सेव करें]             │
│  (Save for later — cached locally)   │
└──────────────────────────────────────┘
```

### 6.3 Session Expired

```
User makes authenticated request
       ↓
Supabase returns 401
       ↓
Attempt token refresh (silent)
  ├── SUCCESS → Continue request transparently
  └── FAILURE → Redirect to /onboarding/phone (pre-fill number if stored)
```

### 6.4 Generic Error Boundary

```
Unhandled error in any screen
       ↓
┌──────────────────────────────────────┐
│  😔 कुछ गड़बड़ हो गई                  │
│  (Something went wrong)              │
│                                      │
│  [🏠 होम पर जाएं]                    │
│  [🔄 पुनः लोड करें]                   │
└──────────────────────────────────────┘
       ↓
Error logged to monitoring service
```

---

## 7. Accessibility Behavior

### 7.1 Visual Accessibility

| Requirement                      | Implementation                                                         |
|----------------------------------|------------------------------------------------------------------------|
| **Sunlight Legibility**          | Minimum contrast ratio 7:1 (WCAG AAA) for all body text.             |
| **High Contrast Mode**           | Auto-detect system preference; manual toggle in Profile > Settings.   |
| **Large Text Default**           | Base font size 18px (not 16px). Headings ≥ 24px.                      |
| **Color-Blind Safe**             | Disease severity uses icons + text labels alongside colors. Never color alone. |
| **No Text in Images**            | All informational content is HTML text, not baked into images.        |

### 7.2 Motor Accessibility

| Requirement                      | Implementation                                                         |
|----------------------------------|------------------------------------------------------------------------|
| **Large Touch Targets**          | All interactive elements ≥ 48px. Primary CTAs ≥ 64px.                |
| **Generous Spacing**             | Minimum 8px gap between adjacent tap targets.                         |
| **No Precision Gestures**        | No swipe-to-delete, pinch-to-zoom required for core flows.           |
| **Single-Tap Actions**           | Every action achievable with a single tap (no long-press required).  |

### 7.3 Cognitive Accessibility

| Requirement                      | Implementation                                                         |
|----------------------------------|------------------------------------------------------------------------|
| **Icon + Text Labels**           | Every button has both an icon AND a text label. Never icon-only.     |
| **Progressive Disclosure**       | Show only essential info first; details in expandable sections.       |
| **Simple Language**              | All UI copy at a 5th-grade reading level in all supported languages. |
| **Consistent Layout**            | Same navigation, same button positions across all screens.            |

### 7.4 Screen Reader Support

| Element                          | ARIA Implementation                                                    |
|----------------------------------|------------------------------------------------------------------------|
| **Scan Button**                  | `aria-label="पौधे का फ़ोटो स्कैन करें"` (localized)                     |
| **Diagnosis Card**               | `role="article"` with `aria-labelledby` for disease name              |
| **Confidence Badge**             | `aria-label="विश्वसनीयता 87 प्रतिशत"`                                   |
| **Navigation Tabs**              | `role="tablist"` with `aria-selected` states                          |
| **Image Previews**               | `alt` text auto-generated: "Uploaded plant image for diagnosis"       |
| **Loading States**               | `aria-live="polite"` for "Analyzing..." announcements                 |

### 7.5 Text-to-Speech Friendliness (for illiterate users)

| Feature                          | Implementation                                                         |
|----------------------------------|------------------------------------------------------------------------|
| **Read Aloud Button**            | ▶️ icon on Diagnosis & Remedy cards. Uses Web Speech API (`speechSynthesis`) with Indian language voices. |
| **Auto-Read Results**            | Option in Settings to auto-read diagnosis results on load.            |
| **Remedy Step-by-Step**          | TTS reads each remedy step with a pause between steps.                |

---

*End of Application Flow Documentation — KrishiVision v1.0.0*
