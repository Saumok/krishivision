import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import type { Locale } from "../../i18n";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: Locale };
}

export default async function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="relative max-w-md mx-auto min-h-screen bg-gray-50">
        {children}
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1B5E20",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
          },
        }}
      />
    </NextIntlClientProvider>
  );
}
