"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Volume2, Leaf, Shield, Zap } from "lucide-react";
import { cn } from "../../lib/utils";

interface Remedy {
  treatment: string;
  organic_alternative: string;
  prevention: string;
  source?: string;
}

interface RemedyCardProps {
  remedy: Remedy | null;
  diseaseName: string;
}

type Section = "treatment" | "organic" | "prevention";

export default function RemedyCard({ remedy, diseaseName }: RemedyCardProps) {
  const t = useTranslations("remedy");
  const [openSection, setOpenSection] = useState<Section>("treatment");

  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = document.documentElement.lang || "hi-IN";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  if (!remedy) {
    return (
      <div className="kv-card bg-disease-orange-light border border-disease-orange/20 animate-fade-in">
        <h3 className="text-body font-bold text-disease-orange">{t("noRemedy")}</h3>
        <p className="text-body-sm text-gray-600 mt-1">{t("noRemedyText")}</p>
      </div>
    );
  }

  const sections: { key: Section; label: string; icon: React.ElementType; content: string }[] = [
    { key: "treatment", label: t("treatment"), icon: Zap,    content: remedy.treatment },
    { key: "organic",   label: t("organic"),   icon: Leaf,   content: remedy.organic_alternative },
    { key: "prevention",label: t("prevention"),icon: Shield, content: remedy.prevention },
  ];

  return (
    <div className="kv-card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-body font-bold text-gray-800">{t("title")}</h3>
        <button
          id="read-aloud-btn"
          onClick={() => speakText(`${diseaseName}. ${remedy.treatment}. ${remedy.organic_alternative}. ${remedy.prevention}`)}
          className="flex items-center gap-1 text-agri-green text-caption font-medium
                     bg-agri-green-muted px-3 py-1.5 rounded-full active:opacity-70"
        >
          <Volume2 size={16} /> {t("readAloud")}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {sections.map(({ key, label, icon: Icon, content }) => {
          const isOpen = openSection === key;
          return (
            <div
              key={key}
              className={cn(
                "rounded-xl border-2 overflow-hidden transition-all duration-200",
                isOpen ? "border-agri-green bg-agri-green-muted" : "border-gray-100 bg-gray-50"
              )}
            >
              <button
                id={`remedy-${key}`}
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => setOpenSection(key)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center",
                    isOpen ? "bg-agri-green text-white" : "bg-white text-gray-500"
                  )}>
                    <Icon size={18} />
                  </div>
                  <span className={cn(
                    "text-body-sm font-semibold",
                    isOpen ? "text-agri-green-dark" : "text-gray-700"
                  )}>
                    {label}
                  </span>
                </div>
                <ChevronDown
                  size={20}
                  className={cn(
                    "text-gray-400 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4">
                  <p className="text-body text-gray-700 leading-relaxed">{content}</p>
                  {remedy.source && key === "treatment" && (
                    <p className="text-caption text-gray-400 mt-2">
                      {t("source")}: {remedy.source}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
