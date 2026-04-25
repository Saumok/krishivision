import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["en", "hi", "bn", "mr", "te", "ta", "gu", "pa", "kn"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "hi";

export const localeNames: Record<Locale, { native: string; english: string }> = {
  en: { native: "English", english: "English" },
  hi: { native: "हिन्दी", english: "Hindi" },
  bn: { native: "বাংলা", english: "Bengali" },
  mr: { native: "मराठी", english: "Marathi" },
  te: { native: "తెలుగు", english: "Telugu" },
  ta: { native: "தமிழ்", english: "Tamil" },
  gu: { native: "ગુજરાતી", english: "Gujarati" },
  pa: { native: "ਪੰਜਾਬੀ", english: "Punjabi" },
  kn: { native: "ಕನ್ನಡ", english: "Kannada" },
};

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();
  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
