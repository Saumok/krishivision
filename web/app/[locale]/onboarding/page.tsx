"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSelector from "@/components/onboarding/LanguageSelector";
import { locales, type Locale } from "@/i18n";

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const params = useParams();
  const currentLocale = params.locale as Locale;
  const [selected, setSelected] = useState<Locale>(currentLocale);

  const handleSelect = (locale: Locale) => {
    setSelected(locale);
  };

  const handleContinue = () => {
    // Save preference to localStorage
    localStorage.setItem("krishi-locale", selected);
    // Navigate to phone page in selected locale
    router.push(`/${selected}/onboarding/phone`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero header */}
      <div className="hero-header text-center">
        <div className="text-5xl mb-3">🌱</div>
        <h1 className="text-heading-lg font-bold">KrishiVision</h1>
        <p className="text-white/80 mt-1 text-body-sm">{t("selectLanguage")}</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 flex flex-col gap-6">
        <p className="text-body text-gray-600 text-center">{t("selectLanguageSubtitle")}</p>

        <LanguageSelector selectedLocale={selected} onSelect={handleSelect} />

        <motion.button
          id="language-continue-btn"
          onClick={handleContinue}
          className="btn-primary"
          whileTap={{ scale: 0.97 }}
        >
          {/* Show "Continue" in selected language */}
          {selected === "hi" ? "आगे बढ़ें →" :
           selected === "bn" ? "এগিয়ে যান →" :
           selected === "mr" ? "पुढे जा →" :
           selected === "te" ? "ముందుకు →" :
           selected === "ta" ? "தொடர் →" :
           selected === "gu" ? "આગળ →" :
           selected === "pa" ? "ਅੱਗੇ →" :
           selected === "kn" ? "ಮುಂದೆ →" :
           "Continue →"}
        </motion.button>
      </div>
    </div>
  );
}
