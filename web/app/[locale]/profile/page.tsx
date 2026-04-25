"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, LogOut, Globe, Clock, HelpCircle, Package } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/layout/BottomNav";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [scanCount, setScanCount] = useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace(`/${locale}/onboarding`); return; }
    setUser(user);

    const { data: p } = await supabase.from("users").select("*").eq("id", user.id).single();
    setProfile(p);

    const { count } = await supabase.from("scans").select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    setScanCount(count ?? 0);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace(`/${locale}/onboarding`);
    toast.success("Logged out");
  };

  const menuItems = [
    { icon: Globe,    label: t("changeLanguage"), action: () => router.push(`/${locale}/onboarding`) },
    { icon: Clock,    label: t("scanHistory"),    action: () => router.push(`/${locale}/profile/history`) },
    { icon: Package,  label: "My Listings",     action: () => router.push(`/${locale}/marketplace`) },
    { icon: HelpCircle, label: t("help"),         action: () => {} },
  ];

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="hero-header">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
            👨‍🌾
          </div>
          <div>
            <h1 className="text-heading font-bold text-white">
              {profile?.name || user?.phone || "Farmer"}
            </h1>
            <p className="text-white/70 text-body-sm">{user?.phone}</p>
            {profile?.created_at && (
              <p className="text-white/50 text-caption">
                {t("memberSince", { date: formatDate(profile.created_at, locale) })}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 bg-white/10 rounded-xl p-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{scanCount}</p>
            <p className="text-white/60 text-body-sm">{t("totalScans")}</p>
          </div>
        </div>
      </div>

      <div className="page-content flex flex-col gap-4">
        {/* Menu */}
        <div className="kv-card p-0 overflow-hidden">
          {menuItems.map(({ icon: Icon, label, action }, i) => (
            <motion.button
              key={label}
              id={`menu-${i}`}
              onClick={action}
              className="w-full flex items-center gap-4 px-4 py-4 text-left
                         border-b border-gray-50 last:border-0
                         active:bg-gray-50 transition-colors"
              whileTap={{ scale: 0.99 }}
            >
              <div className="w-10 h-10 bg-agri-green-muted rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-agri-green" />
              </div>
              <span className="flex-1 text-body font-medium text-gray-800">{label}</span>
              <ChevronRight size={18} className="text-gray-300" />
            </motion.button>
          ))}
        </div>

        {/* Logout */}
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="kv-card flex items-center gap-4 text-disease-red active:bg-disease-red-light transition-colors"
        >
          <div className="w-10 h-10 bg-disease-red-light rounded-xl flex items-center justify-center">
            <LogOut size={20} className="text-disease-red" />
          </div>
          <span className="text-body font-medium">{t("logout")}</span>
        </button>

        <p className="text-center text-caption text-gray-300">KrishiVision v1.0.0</p>
      </div>

      <BottomNav locale={locale} />
    </div>
  );
}
