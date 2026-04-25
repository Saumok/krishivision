import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string, locale: string = "en-IN"): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const EXPERT_PHONE = "+919999999999"; // Replace with real expert number
export const EXPERT_WHATSAPP = `https://wa.me/919999999999`;

export const MARKETPLACE_CATEGORIES = [
  "equipment",
  "seeds",
  "fertilizer",
  "pesticide",
  "produce",
  "other",
] as const;

export type MarketplaceCategory = (typeof MARKETPLACE_CATEGORIES)[number];
