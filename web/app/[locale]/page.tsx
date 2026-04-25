"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ScanLine, ChevronRight } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { createClient } from "@/lib/supabase/client";
import { loadModel } from "@/lib/model";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [modelStatus, setModelStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    // Get user session
    supabase.auth.getUser().then(({ data }: { data: { user: any } }) => {
      setUser(data.user);
      // Redirect to onboarding if no session
      if (!data.user) {
        router.replace(`/${locale}/onboarding`);
      }
    });

    // Preload TF.js model in background
    loadModel()
      .then(() => setModelStatus("ready"))
      .catch(() => setModelStatus("error"));

    // Fetch recent scans
    fetchRecentScans();
  }, []);

  const fetchRecentScans = async () => {
    const { data } = await supabase
      .from("scans")
      .select("id, created_at, disease_name, confidence, crop_name, image_url")
      .order("created_at", { ascending: false })
      .limit(3);
    if (data) setRecentScans(data);
  };

  return (
    <div className="page-shell">
      {/* Hero header */}
      <div className="hero-header">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-body-sm">{formatDate(new Date().toISOString(), locale)}</p>
            <h1 className="text-heading-lg font-bold text-white mt-1">
              {user?.user_metadata?.name
                ? t("home.greetingName", { name: user.user_metadata.name })
                : t("home.greeting")}
            </h1>
          </div>
          <div className="text-5xl">🌿</div>
        </div>

        {/* Model status indicator */}
        <div className="mt-3 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            modelStatus === "ready" ? "bg-green-300" :
            modelStatus === "loading" ? "bg-yellow-300 animate-pulse" : "bg-red-300"
          }`} />
          <span className="text-white/60 text-caption">
            {modelStatus === "ready" ? t("home.modelReady") :
             modelStatus === "loading" ? t("home.modelLoading") : "Model error"}
          </span>
        </div>
      </div>

      <div className="page-content flex flex-col gap-6">
        {/* BIG SCAN CTA */}
        <motion.button
          id="home-scan-btn"
          onClick={() => router.push(`/${locale}/scan`)}
          className="btn-primary h-20 text-heading-sm shadow-lg"
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ScanLine size={32} />
          <div className="text-left">
            <div className="font-bold">{t("home.scanCta")}</div>
            <div className="text-body-sm font-normal text-white/70">{t("home.scanSubtitle")}</div>
          </div>
        </motion.button>

        {/* Tip card */}
        <motion.div
          className="kv-card bg-harvest-gold-light border border-harvest-gold/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="font-bold text-gray-800">{t("home.tip")}</p>
          <p className="text-body-sm text-gray-600 mt-0.5">{t("home.tipText")}</p>
        </motion.div>

        {/* Recent scans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-heading mb-0">{t("home.recentScans")}</h2>
            {recentScans.length > 0 && (
              <button
                onClick={() => router.push(`/${locale}/profile/history`)}
                className="text-agri-green text-body-sm font-semibold flex items-center gap-1"
              >
                {t("scan.historyTitle")} <ChevronRight size={16} />
              </button>
            )}
          </div>

          {recentScans.length === 0 ? (
            <div className="kv-card text-center py-10">
              <div className="text-5xl mb-3">📷</div>
              <p className="text-body text-gray-400 whitespace-pre-line">{t("home.noScans")}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentScans.map((scan) => (
                <button
                  key={scan.id}
                  id={`recent-scan-${scan.id}`}
                  onClick={() => router.push(`/${locale}/scan/result/${scan.id}`)}
                  className="kv-card flex items-center gap-4 text-left active:scale-[0.99] transition-transform"
                >
                  <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    {scan.image_url ? (
                      <img src={scan.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl flex items-center justify-center h-full">🌿</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate">{scan.disease_name}</p>
                    <p className="text-caption text-gray-500">{scan.crop_name} · {scan.confidence?.toFixed(0)}%</p>
                    <p className="text-caption text-gray-400">{formatDate(scan.created_at, locale)}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <BottomNav locale={locale} />
    </div>
  );
}
