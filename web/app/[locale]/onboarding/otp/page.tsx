"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function OtpForm() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const phone = searchParams.get("phone") ?? "";
  const supabase = createClient();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Start countdown
    const interval = setInterval(() => {
      setResendTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-verify when all 6 digits entered
    if (otp.every((d) => d !== "")) {
      handleVerify();
    }
  }, [otp]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Move to next cell
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ phone, token: code, type: "sms" });
      if (error) throw error;
      toast.success("✓ Verified!");
      router.replace(`/${locale}`);
    } catch (err: any) {
      toast.error(t("invalidOtp"));
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    await supabase.auth.signInWithOtp({ phone });
    toast.success(t("otpSent"));
    setResendTimer(30);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="hero-header text-center">
        <div className="text-5xl mb-3">🔐</div>
        <h1 className="text-heading font-bold text-white">{t("otpTitle")}</h1>
        <p className="text-white/70 text-body-sm mt-1">{t("otpSubtitle")}</p>
        <p className="text-white font-bold text-body mt-1">{phone}</p>
      </div>

      <div className="flex-1 px-4 py-8 flex flex-col gap-8">
        {/* OTP cells */}
        <div className="flex gap-3 justify-center">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="otp-cell"
              autoFocus={i === 0}
            />
          ))}
        </div>

        <button
          id="verify-btn"
          onClick={handleVerify}
          disabled={otp.join("").length !== 6 || loading}
          className="btn-primary"
        >
          {loading
            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
            : null}
          {loading ? "..." : t("verify")}
        </button>

        <div className="text-center">
          {resendTimer > 0 ? (
            <p className="text-gray-400 text-body-sm">{t("resendIn", { seconds: resendTimer })}</p>
          ) : (
            <button
              id="resend-btn"
              onClick={handleResend}
              className="text-agri-green font-semibold text-body"
            >
              {t("resend")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense>
      <OtpForm />
    </Suspense>
  );
}
