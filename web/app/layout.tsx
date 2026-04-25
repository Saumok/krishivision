import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

// Noto Sans covers Latin + Devanagari (Hindi, Marathi)
// Other Indic scripts are handled by the system's built-in fonts as fallback
const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
  variable: "--font-noto-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KrishiVision — AI Crop Disease Diagnosis",
  description: "AI-powered crop disease detection and agri marketplace for Indian farmers. Free, instant, multilingual.",
  keywords: ["crop disease", "plant disease", "farmer app", "agri marketplace", "KrishiVision"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KrishiVision",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2D7A3A",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${notoSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
