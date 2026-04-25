"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, ChevronRight, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import BottomNav from "@/components/layout/BottomNav";

export default function ScanHistoryPage() {
  const t = useTranslations("profile");
  const ts = useTranslations("scan");
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const supabase = createClient();

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("scans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setHistory(data);
    setLoading(false);
  };

  return (
    <div className="page-shell">
      <div className="hero-header flex items-center gap-3">
        <button onClick={() => router.back()} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-heading font-bold text-white">{t("scanHistory")}</h1>
      </div>

      <div className="page-content flex flex-col gap-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="kv-card flex items-center gap-4">
              <div className="skeleton w-14 h-14 rounded-xl flex-shrink-0" />
              <div className="flex-1">
                <div className="skeleton h-4 w-3/4 mb-2" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : history.length === 0 ? (
          <div className="kv-card text-center py-20 bg-white/50 border-2 border-dashed border-gray-100">
            <div className="text-5xl mb-4">📜</div>
            <p className="text-body text-gray-400">{ts("noHistory")}</p>
            <button
              onClick={() => router.push(`/${locale}/scan`)}
              className="text-agri-green font-bold mt-2"
            >
              + {ts("newScan")}
            </button>
          </div>
        ) : (
          history.map((scan) => (
            <button
              key={scan.id}
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
                <p className="text-caption text-gray-500 font-medium">
                  {scan.crop_name} · {scan.confidence ? (scan.confidence * 100).toFixed(0) : "0"}%
                </p>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                  <Calendar size={10} />
                  {formatDate(scan.created_at, locale)}
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />
            </button>
          ))
        )}
      </div>

      <BottomNav locale={locale} />
    </div>
  );
}
