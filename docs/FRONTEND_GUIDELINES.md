# KrishiVision — Frontend Design Guidelines

---

## 1. Design Principles

KrishiVision's UI must serve a first-time smartphone user standing in a sunlit field. Every design decision flows from this context.

### Core Principles

| #   | Principle                    | Description                                                                                              |
|-----|------------------------------|----------------------------------------------------------------------------------------------------------|
| 1   | **High Contrast First**      | All text must meet WCAG AAA (7:1 contrast ratio). The screen is viewed in direct sunlight.               |
| 2   | **Icon-Heavy, Text-Light**   | Every action is represented by a universally understood icon alongside short text. Minimize reading.      |
| 3   | **Native-Language First**    | Hindi is the default locale. English is a secondary option. All copy written for 5th-grade reading level.|
| 4   | **Large Touch Targets**      | Minimum 48px for any interactive element. Primary CTAs ≥ 64px. Farmers have calloused, large hands.     |
| 5   | **Minimal Cognitive Load**   | Maximum 3 choices per screen. No nested menus. One clear action per screen.                              |
| 6   | **Offline-Aware**            | UI always shows cached data gracefully. Never a blank screen — even without internet.                    |
| 7   | **Earthy & Trustworthy**     | The color palette evokes agriculture, nature, and reliability. Avoid corporate/tech aesthetics.           |

---

## 2. Design Tokens

### 2.1 Color Palette

#### Primary Colors

| Token                  | Hex         | HSL                  | Usage                                       |
|------------------------|-------------|----------------------|---------------------------------------------|
| `--color-agri-green`   | `#2D7A3A`   | `130, 45%, 33%`      | Primary CTA, scan button, success states    |
| `--color-agri-green-light` | `#4CAF50` | `122, 39%, 49%`   | Hover states, secondary green elements      |
| `--color-agri-green-dark`  | `#1B5E20` | `125, 56%, 24%`   | Active/pressed states                       |

#### Secondary Colors

| Token                  | Hex         | HSL                  | Usage                                       |
|------------------------|-------------|----------------------|---------------------------------------------|
| `--color-soil-brown`   | `#5D4037`   | `16, 20%, 29%`       | Navigation bar, headers, grounding elements |
| `--color-soil-light`   | `#8D6E63`   | `16, 16%, 47%`       | Borders, dividers, muted text               |
| `--color-soil-cream`   | `#EFEBE9`   | `16, 23%, 92%`       | Card backgrounds, input fields              |

#### Accent Colors

| Token                  | Hex         | HSL                  | Usage                                       |
|------------------------|-------------|----------------------|---------------------------------------------|
| `--color-harvest-gold` | `#F9A825`   | `43, 95%, 56%`       | Marketplace CTA, price tags, highlights     |
| `--color-sky-blue`     | `#0288D1`   | `199, 98%, 41%`      | Links, informational badges, secondary CTA  |

#### Semantic / Alert Colors

| Token                  | Hex         | HSL                  | Usage                                       |
|------------------------|-------------|----------------------|---------------------------------------------|
| `--color-disease-red`  | `#D32F2F`   | `0, 65%, 51%`        | Disease severity HIGH, critical warnings    |
| `--color-disease-orange`| `#F57C00`  | `27, 100%, 48%`      | Disease severity MEDIUM, caution states     |
| `--color-disease-yellow`| `#FBC02D`  | `46, 97%, 58%`       | Disease severity LOW, informational alerts  |
| `--color-healthy-green`| `#388E3C`   | `122, 42%, 39%`      | Healthy plant indicator, success states     |

#### Neutral Colors

| Token                  | Hex         | Usage                                       |
|------------------------|-------------|---------------------------------------------|
| `--color-white`        | `#FFFFFF`   | Page background                             |
| `--color-gray-50`      | `#FAFAFA`   | Subtle backgrounds                          |
| `--color-gray-100`     | `#F5F5F5`   | Card backgrounds                            |
| `--color-gray-300`     | `#E0E0E0`   | Borders, dividers                           |
| `--color-gray-600`     | `#757575`   | Secondary text                              |
| `--color-gray-800`     | `#424242`   | Primary text                                |
| `--color-gray-900`     | `#212121`   | Headings                                    |

### 2.2 Tailwind CSS Configuration

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          green: '#2D7A3A',
          'green-light': '#4CAF50',
          'green-dark': '#1B5E20',
        },
        soil: {
          brown: '#5D4037',
          light: '#8D6E63',
          cream: '#EFEBE9',
        },
        harvest: {
          gold: '#F9A825',
        },
        sky: {
          blue: '#0288D1',
        },
        disease: {
          red: '#D32F2F',
          orange: '#F57C00',
          yellow: '#FBC02D',
        },
        healthy: {
          green: '#388E3C',
        },
      },
      spacing: {
        'touch-sm': '44px',
        'touch': '48px',
        'touch-lg': '56px',
        'touch-xl': '64px',
        'touch-2xl': '80px',
      },
      fontSize: {
        'body': ['18px', '28px'],        // Base body text (larger than default 16px)
        'body-sm': ['16px', '24px'],     // Secondary text
        'heading-lg': ['28px', '36px'],  // Page headings
        'heading': ['24px', '32px'],     // Section headings
        'heading-sm': ['20px', '28px'],  // Card headings
        'caption': ['14px', '20px'],     // Captions, metadata
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'input': '10px',
        'badge': '20px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
        'button': '0 2px 4px rgba(45, 122, 58, 0.3)',
        'nav': '0 -2px 10px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 3. Typography

### 3.1 Font Family

KrishiVision uses the **Noto Sans** superfamily to ensure beautiful rendering of all Indian scripts.

| Script         | Font Family               | Languages              | Google Fonts ID            |
|----------------|---------------------------|------------------------|----------------------------|
| **Latin**      | Noto Sans                 | English                | `Noto+Sans`                |
| **Devanagari** | Noto Sans Devanagari      | Hindi, Marathi         | `Noto+Sans+Devanagari`     |
| **Bengali**    | Noto Sans Bengali         | Bengali                | `Noto+Sans+Bengali`        |
| **Telugu**     | Noto Sans Telugu          | Telugu                 | `Noto+Sans+Telugu`         |
| **Tamil**      | Noto Sans Tamil           | Tamil                  | `Noto+Sans+Tamil`          |
| **Gujarati**   | Noto Sans Gujarati        | Gujarati               | `Noto+Sans+Gujarati`       |
| **Gurmukhi**   | Noto Sans Gurmukhi        | Punjabi                | `Noto+Sans+Gurmukhi`       |
| **Kannada**    | Noto Sans Kannada         | Kannada                | `Noto+Sans+Kannada`        |

### 3.2 Type Scale

| Level            | Size   | Weight     | Line Height | Usage                                |
|------------------|--------|------------|-------------|--------------------------------------|
| **Display**      | 32px   | 700 (Bold) | 40px        | Splash screen app name              |
| **Heading 1**    | 28px   | 700 (Bold) | 36px        | Page titles                         |
| **Heading 2**    | 24px   | 600 (Semi) | 32px        | Section titles, card headers        |
| **Heading 3**    | 20px   | 600 (Semi) | 28px        | Sub-section titles                  |
| **Body**         | 18px   | 400 (Reg)  | 28px        | Primary content, remedy text        |
| **Body Small**   | 16px   | 400 (Reg)  | 24px        | Secondary content, descriptions     |
| **Caption**      | 14px   | 400 (Reg)  | 20px        | Timestamps, metadata, badges        |
| **Button**       | 18px   | 600 (Semi) | 24px        | Button labels                       |

### 3.3 Font Loading Implementation

```typescript
// app/layout.tsx
import {
  Noto_Sans,
  Noto_Sans_Devanagari,
} from 'next/font/google';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-noto-sans',
  display: 'swap',
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '600', '700'],
  variable: '--font-noto-devanagari',
  display: 'swap',
});

// Apply in layout:
// <html className={`${notoSans.variable} ${notoSansDevanagari.variable}`}>
// CSS: font-family: var(--font-noto-devanagari), var(--font-noto-sans), sans-serif;
```

---

## 4. Component Library

### 4.1 Scan Button (Primary CTA)

The most important button in the entire app. It must be **impossible to miss**.

```tsx
// components/ScanButton.tsx
export function ScanButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      id="scan-button-cta"
      onClick={onClick}
      aria-label={label}
      className="
        relative flex items-center justify-center gap-3
        w-full max-w-sm mx-auto
        h-touch-xl
        bg-agri-green hover:bg-agri-green-light active:bg-agri-green-dark
        text-white font-semibold text-body
        rounded-button
        shadow-button
        transition-all duration-200 ease-in-out
        active:scale-[0.97]
        focus:outline-none focus:ring-4 focus:ring-agri-green/30
      "
    >
      {/* Camera Icon */}
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
```

### 4.2 Image Upload States

```tsx
// components/ImageUpload.tsx
export function ImageUpload({
  state,
  imageUrl,
  progress,
  onRetake,
  onSubmit,
  onUpload,
  labels,
}: {
  state: 'idle' | 'preview' | 'uploading' | 'success' | 'error';
  imageUrl?: string;
  progress?: number;
  onRetake: () => void;
  onSubmit: () => void;
  onUpload: () => void;
  labels: { upload: string; retake: string; submit: string; analyzing: string; error: string };
}) {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* IDLE STATE: Upload prompt */}
      {state === 'idle' && (
        <button
          id="image-upload-trigger"
          onClick={onUpload}
          className="
            flex flex-col items-center justify-center gap-3
            w-full aspect-[4/3] max-w-sm
            border-2 border-dashed border-agri-green/40
            bg-soil-cream/50 rounded-card
            hover:border-agri-green hover:bg-soil-cream
            transition-all duration-200
          "
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2D7A3A" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span className="text-body text-agri-green font-semibold">{labels.upload}</span>
        </button>
      )}

      {/* PREVIEW STATE: Show captured image */}
      {state === 'preview' && imageUrl && (
        <div className="w-full max-w-sm">
          <img
            src={imageUrl}
            alt="Captured plant"
            className="w-full aspect-[4/3] object-cover rounded-card shadow-card"
          />
          <div className="flex gap-3 mt-4">
            <button
              id="image-retake-btn"
              onClick={onRetake}
              className="
                flex-1 h-touch-lg flex items-center justify-center gap-2
                bg-disease-red/10 text-disease-red font-semibold text-body
                rounded-button border-2 border-disease-red/30
                active:scale-[0.97] transition-all
              "
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              {labels.retake}
            </button>
            <button
              id="image-submit-btn"
              onClick={onSubmit}
              className="
                flex-1 h-touch-lg flex items-center justify-center gap-2
                bg-agri-green text-white font-semibold text-body
                rounded-button shadow-button
                active:scale-[0.97] transition-all
              "
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {labels.submit}
            </button>
          </div>
        </div>
      )}

      {/* UPLOADING STATE */}
      {state === 'uploading' && (
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="w-16 h-16 border-4 border-agri-green/20 border-t-agri-green rounded-full animate-spin" />
          <p className="text-body text-gray-800 font-semibold">{labels.analyzing}</p>
          {progress !== undefined && (
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-agri-green rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* ERROR STATE */}
      {state === 'error' && (
        <div className="flex flex-col items-center gap-4 p-6 bg-disease-red/5 rounded-card border border-disease-red/20">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <p className="text-body text-disease-red font-semibold">{labels.error}</p>
          <button
            id="image-retry-btn"
            onClick={onRetake}
            className="h-touch-lg px-8 bg-disease-red text-white font-semibold rounded-button active:scale-[0.97] transition-all"
          >
            {labels.retake}
          </button>
        </div>
      )}
    </div>
  );
}
```

### 4.3 Diagnosis Card

```tsx
// components/DiagnosisCard.tsx
export function DiagnosisCard({
  diseaseName,
  cropName,
  confidence,
  severity,
}: {
  diseaseName: string;
  cropName: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
}) {
  const severityConfig = {
    low: { bg: 'bg-disease-yellow/10', text: 'text-disease-yellow', border: 'border-disease-yellow/30', icon: '⚠️' },
    medium: { bg: 'bg-disease-orange/10', text: 'text-disease-orange', border: 'border-disease-orange/30', icon: '🔶' },
    high: { bg: 'bg-disease-red/10', text: 'text-disease-red', border: 'border-disease-red/30', icon: '🔴' },
  };

  const s = severityConfig[severity];

  return (
    <div
      id="diagnosis-card"
      role="article"
      className={`
        w-full max-w-sm mx-auto p-5
        ${s.bg} border-2 ${s.border}
        rounded-card shadow-card
      `}
    >
      {/* Disease Name */}
      <h2 className="text-heading font-bold text-gray-900 mb-1">
        {s.icon} {diseaseName}
      </h2>

      {/* Crop Name */}
      <p className="text-body-sm text-gray-600 mb-4">
        🌱 {cropName}
      </p>

      {/* Confidence Badge */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              confidence >= 80 ? 'bg-healthy-green' :
              confidence >= 60 ? 'bg-disease-orange' :
              'bg-disease-red'
            }`}
            style={{ width: `${confidence}%` }}
            role="progressbar"
            aria-valuenow={confidence}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <span className={`text-body font-bold ${
          confidence >= 80 ? 'text-healthy-green' :
          confidence >= 60 ? 'text-disease-orange' :
          'text-disease-red'
        }`}>
          {confidence}%
        </span>
      </div>
    </div>
  );
}
```

### 4.4 Remedy Card

```tsx
// components/RemedyCard.tsx
export function RemedyCard({
  treatment,
  organicAlternative,
  prevention,
  labels,
}: {
  treatment: string;
  organicAlternative: string;
  prevention: string;
  labels: { treatment: string; organic: string; prevention: string };
}) {
  return (
    <div id="remedy-card" className="w-full max-w-sm mx-auto space-y-4 mt-4">
      {/* Treatment */}
      <div className="p-4 bg-white border border-gray-200 rounded-card shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">💊</span>
          <h3 className="text-heading-sm font-semibold text-gray-900">{labels.treatment}</h3>
        </div>
        <p className="text-body text-gray-700 leading-relaxed">{treatment}</p>
      </div>

      {/* Organic Alternative */}
      <div className="p-4 bg-agri-green/5 border border-agri-green/20 rounded-card shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🌿</span>
          <h3 className="text-heading-sm font-semibold text-agri-green-dark">{labels.organic}</h3>
        </div>
        <p className="text-body text-gray-700 leading-relaxed">{organicAlternative}</p>
      </div>

      {/* Prevention */}
      <div className="p-4 bg-sky-blue/5 border border-sky-blue/20 rounded-card shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🛡️</span>
          <h3 className="text-heading-sm font-semibold text-sky-blue">{labels.prevention}</h3>
        </div>
        <p className="text-body text-gray-700 leading-relaxed">{prevention}</p>
      </div>
    </div>
  );
}
```

### 4.5 Marketplace Listing Card

```tsx
// components/MarketplaceCard.tsx
export function MarketplaceCard({
  id,
  imageUrl,
  title,
  price,
  location,
  postedAt,
  onClick,
}: {
  id: string;
  imageUrl: string;
  title: string;
  price: number;
  location: string;
  postedAt: string;
  onClick: () => void;
}) {
  return (
    <button
      id={`marketplace-card-${id}`}
      onClick={onClick}
      className="
        w-full text-left
        bg-white rounded-card shadow-card
        hover:shadow-card-hover
        transition-all duration-200
        active:scale-[0.98]
        overflow-hidden
        focus:outline-none focus:ring-2 focus:ring-agri-green/30
      "
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Price Tag */}
        <div className="absolute bottom-2 left-2 px-3 py-1 bg-harvest-gold text-gray-900 font-bold text-body-sm rounded-badge shadow-md">
          ₹{price.toLocaleString('en-IN')}
        </div>
      </div>

      {/* Details */}
      <div className="p-3">
        <h3 className="text-body font-semibold text-gray-900 truncate">{title}</h3>
        <div className="flex items-center gap-1 mt-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-caption text-gray-600 truncate">{location}</span>
        </div>
        <p className="text-caption text-gray-400 mt-1">{postedAt}</p>
      </div>
    </button>
  );
}
```

### 4.6 Bottom Navigation Bar

```tsx
// components/BottomNav.tsx
export function BottomNav({
  activeTab,
  labels,
  onNavigate,
}: {
  activeTab: 'home' | 'marketplace' | 'profile';
  labels: { home: string; marketplace: string; profile: string };
  onNavigate: (tab: 'home' | 'marketplace' | 'profile') => void;
}) {
  const tabs = [
    {
      key: 'home' as const,
      label: labels.home,
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#2D7A3A' : 'none'} stroke={active ? '#2D7A3A' : '#757575'} strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      key: 'marketplace' as const,
      label: labels.marketplace,
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#2D7A3A' : 'none'} stroke={active ? '#2D7A3A' : '#757575'} strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      ),
    },
    {
      key: 'profile' as const,
      label: labels.profile,
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#2D7A3A' : 'none'} stroke={active ? '#2D7A3A' : '#757575'} strokeWidth="2">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      role="tablist"
      className="
        fixed bottom-0 left-0 right-0 z-50
        flex items-center justify-around
        h-touch-xl bg-white
        border-t border-gray-200
        shadow-nav
        safe-area-pb
      "
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            id={`nav-tab-${tab.key}`}
            onClick={() => onNavigate(tab.key)}
            className={`
              flex flex-col items-center justify-center gap-0.5
              flex-1 h-full
              transition-colors duration-150
              ${isActive ? 'text-agri-green' : 'text-gray-500'}
            `}
          >
            {tab.icon(isActive)}
            <span className={`text-[12px] font-medium ${isActive ? 'text-agri-green' : 'text-gray-500'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
```

### 4.7 Language Selector Grid

```tsx
// components/LanguageSelector.tsx
const LANGUAGES = [
  { code: 'hi', name: 'हिन्दी', nameEn: 'Hindi' },
  { code: 'en', name: 'English', nameEn: 'English' },
  { code: 'bn', name: 'বাংলা', nameEn: 'Bengali' },
  { code: 'mr', name: 'मराठी', nameEn: 'Marathi' },
  { code: 'te', name: 'తెలుగు', nameEn: 'Telugu' },
  { code: 'ta', name: 'தமிழ்', nameEn: 'Tamil' },
  { code: 'gu', name: 'ગુજરાતી', nameEn: 'Gujarati' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', nameEn: 'Punjabi' },
  { code: 'kn', name: 'ಕನ್ನಡ', nameEn: 'Kannada' },
];

export function LanguageSelector({
  currentLocale,
  onSelect,
}: {
  currentLocale: string;
  onSelect: (locale: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 p-4 max-w-sm mx-auto">
      {LANGUAGES.map((lang) => {
        const isSelected = currentLocale === lang.code;
        return (
          <button
            key={lang.code}
            id={`lang-select-${lang.code}`}
            onClick={() => onSelect(lang.code)}
            className={`
              flex flex-col items-center justify-center
              h-touch-lg px-4
              rounded-button border-2
              transition-all duration-200
              active:scale-[0.97]
              ${isSelected
                ? 'bg-agri-green text-white border-agri-green shadow-button'
                : 'bg-white text-gray-800 border-gray-200 hover:border-agri-green/50'
              }
            `}
          >
            <span className="text-body font-semibold">{lang.name}</span>
            <span className={`text-caption ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
              {lang.nameEn}
            </span>
          </button>
        );
      })}
    </div>
  );
}
```

---

## 5. Accessibility Guidelines

### 5.1 Sunlight Legibility

| Element            | Minimum Contrast | Achieved Contrast | Method                                  |
|--------------------|------------------|-------------------|-----------------------------------------|
| Body text          | 7:1 (AAA)        | 10.5:1            | `#424242` on `#FFFFFF`                 |
| Headings           | 7:1 (AAA)        | 14.2:1            | `#212121` on `#FFFFFF`                 |
| Primary button     | 4.5:1 (AA)       | 6.3:1             | `#FFFFFF` on `#2D7A3A`                 |
| Disease red        | 4.5:1 (AA)       | 5.9:1             | `#D32F2F` on `#FFFFFF` (used with icon)|
| Caption/metadata   | 4.5:1 (AA)       | 4.6:1             | `#757575` on `#FFFFFF`                 |

### 5.2 Text-to-Speech (TTS) Friendliness

```tsx
// components/ReadAloudButton.tsx
export function ReadAloudButton({ text, lang }: { text: string; lang: string }) {
  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang; // e.g., 'hi-IN', 'te-IN', 'ta-IN'
    utterance.rate = 0.85; // Slightly slower for clarity
    speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      aria-label="Read aloud"
      className="
        flex items-center gap-2 px-4 h-touch
        bg-sky-blue/10 text-sky-blue font-semibold
        rounded-button border border-sky-blue/20
        active:scale-[0.97] transition-all
      "
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
      </svg>
      <span className="text-body-sm">🔊</span>
    </button>
  );
}
```

### 5.3 Screen Reader Testing Checklist

| Element                | Required ARIA                                     | ✅ |
|------------------------|---------------------------------------------------|----|
| Scan Button            | `aria-label` in active locale                     | ☐  |
| Diagnosis Card         | `role="article"`, `aria-labelledby`               | ☐  |
| Confidence Bar         | `role="progressbar"`, `aria-valuenow`             | ☐  |
| Bottom Nav Tabs        | `role="tablist"`, `role="tab"`, `aria-selected`   | ☐  |
| Loading Spinner        | `aria-live="polite"`, hidden from screen readers  | ☐  |
| Image Previews         | Descriptive `alt` text                            | ☐  |
| Error Messages         | `role="alert"`, `aria-live="assertive"`           | ☐  |
| Language Buttons       | `aria-label` with full language name               | ☐  |

---

## 6. Icon System

### 6.1 Icon Library: Lucide React

KrishiVision uses [**Lucide React**](https://lucide.dev/) — a tree-shakeable, open-source icon set.

### 6.2 Agricultural Icon Mapping

| Action / Concept     | Icon Name (Lucide)   | Supplement                | Unicode Fallback |
|----------------------|----------------------|---------------------------|------------------|
| Scan / Camera        | `Camera`             | —                         | 📷               |
| Home                 | `Home`               | —                         | 🏠               |
| Marketplace          | `ShoppingBag`        | —                         | 🏪               |
| Profile              | `User`               | —                         | 👤               |
| Add Listing          | `Plus`               | —                         | ➕               |
| Location             | `MapPin`             | —                         | 📍               |
| Phone / Call         | `Phone`              | —                         | 📞               |
| WhatsApp             | Custom SVG           | Brand icon                | 💬               |
| Plant / Crop         | `Leaf` or `Sprout`   | —                         | 🌱               |
| Disease Warning      | `AlertTriangle`      | —                         | ⚠️               |
| Treatment / Remedy   | `Pill`               | Combined with 🌿 for organic | 💊           |
| Share                | `Share2`             | —                         | 📤               |
| History              | `Clock`              | —                         | 📜               |
| Settings             | `Settings`           | —                         | ⚙️               |
| Search               | `Search`             | —                         | 🔍               |
| Gallery / Upload     | `Image`              | —                         | 🖼️               |
| Expert               | `HeadphonesIcon`     | Or custom agri scientist  | 👨‍🌾              |
| Success / Healthy    | `CheckCircle`        | —                         | ✅               |
| Error / Failed       | `XCircle`            | —                         | ❌               |
| Retry                | `RotateCcw`          | —                         | 🔄               |

### 6.3 Icon Sizing Standards

| Context              | Size   | Stroke Width | Example                                |
|----------------------|--------|--------------|----------------------------------------|
| Bottom Nav           | 24px   | 2px          | Navigation tab icons                   |
| Primary CTA          | 28px   | 2px          | Inside scan button                     |
| Card Icon            | 20px   | 2px          | Inside diagnosis/remedy cards          |
| Inline (with text)   | 16px   | 2px          | Location pin next to address           |
| Empty State          | 48px   | 1.5px        | Large illustrative icon                |

### 6.4 Usage Rules

1. **Always pair with text**: No icon-only buttons in the UI (except bottom nav, where text label is always shown below).
2. **Use consistent stroke width**: 2px for all functional icons.
3. **Color follows context**: Active = `agri-green`, Inactive = `gray-500`, Error = `disease-red`.
4. **Emoji as supplements**: Use emoji (🌱, 💊, 🛡️) in content areas (diagnosis cards, remedies) for visual warmth. Use Lucide SVGs for interactive elements.

---

*End of Frontend Design Guidelines — KrishiVision v1.0.0*
