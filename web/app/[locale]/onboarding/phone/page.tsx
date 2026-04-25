"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function PhonePage() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const supabase = createClient();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidPhone = /^\d{10}$/.test(phone.replace(/\s/g, ""));

  const handleSendOtp = async () => {
    if (!isValidPhone) {
      toast.error(t("invalidPhone"));
      return;
    }
    setLoading(true);
    try {
      const fullPhone = `+91${phone.replace(/\s/g, "")}`;
      const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
      if (error) throw error;
      toast.success(t("otpSent"));
      router.push(`/${locale}/onboarding/otp?phone=${encodeURIComponent(fullPhone)}`);
    } catch (err: any) {
      toast.error(err?.message ?? t("invalidPhone"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="hero-header">
        <button
          id="back-btn"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 mb-4"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <Phone size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-heading font-bold text-white">{t("phoneTitle")}</h1>
            <p className="text-white/70 text-body-sm">{t("phoneSubtitle")}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-4 py-8 flex flex-col gap-6">
        {/* Phone input */}
        <div>
          <label className="text-body-sm font-semibold text-gray-600 mb-2 block">
            📱 {t("phonePlaceholder")}
          </label>
          <div className="flex gap-2">
            {/* Country code */}
            <div className="flex items-center justify-center h-touch px-4
                            bg-gray-100 border-2 border-gray-200 rounded-input
                            text-body font-bold text-gray-700 whitespace-nowrap">
              🇮🇳 +91
            </div>
            {/* Number input */}
            <input
              id="phone-input"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="XXXXXXXXXX"
              className="kv-input"
              onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
            />
          </div>
        </div>

        <button
          id="send-otp-btn"
          onClick={handleSendOtp}
          disabled={!isValidPhone || loading}
          className="btn-primary"
        >
          {loading ? (
            <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : null}
          {loading ? "..." : t("sendOtp")}
        </button>

        <p className="text-center text-caption text-gray-400">
          🔒 OTP via SMS · No password required
        </p>
      </div>
    </div>
  );
}
