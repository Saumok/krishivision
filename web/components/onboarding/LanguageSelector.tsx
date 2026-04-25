"use client";
import { useTranslations } from "next-intl";
import { locales, localeNames, type Locale } from "../../i18n";
import { CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface LanguageSelectorProps {
  selectedLocale: Locale;
  onSelect: (locale: Locale) => void;
}

export default function LanguageSelector({ selectedLocale, onSelect }: LanguageSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {locales.map((locale) => {
        const { native, english } = localeNames[locale];
        const isSelected = locale === selectedLocale;
        return (
          <button
            key={locale}
            id={`lang-${locale}`}
            onClick={() => onSelect(locale)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1",
              "h-touch-2xl rounded-card border-2 transition-all duration-200",
              "active:scale-[0.97]",
              isSelected
                ? "border-agri-green bg-agri-green-muted shadow-md"
                : "border-gray-200 bg-white hover:border-agri-green-light"
            )}
          >
            {isSelected && (
              <CheckCircle2
                size={20}
                className="absolute top-2 right-2 text-agri-green"
                fill="currentColor"
                strokeWidth={0}
              />
            )}
            <span className={cn(
              "text-xl font-bold",
              isSelected ? "text-agri-green-dark" : "text-gray-800"
            )}>
              {native}
            </span>
            <span className="text-caption text-gray-400">{english}</span>
          </button>
        );
      })}
    </div>
  );
}
