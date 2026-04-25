"use client";
import { useTranslations } from "next-intl";
import { CheckCircle2, AlertTriangle, Activity } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Prediction } from "../../lib/model";

interface DiagnosisCardProps {
  prediction: Prediction;
  localizedDiseaseName?: string;
  localizedCropName?: string;
}

export default function DiagnosisCard({
  prediction,
  localizedDiseaseName,
  localizedCropName,
}: DiagnosisCardProps) {
  const t = useTranslations("diagnosis");

  const isHealthy = prediction.isHealthy;
  const displayDisease = localizedDiseaseName ?? prediction.diseaseEn;
  const displayCrop = localizedCropName ?? prediction.cropEn;

  const confidenceColor = prediction.confidence >= 80
    ? "text-healthy-green"
    : prediction.confidence >= 60
    ? "text-harvest-gold"
    : "text-disease-orange";

  const severityClasses: Record<string, string> = {
    none: "severity-none",
    low: "severity-low",
    medium: "severity-medium",
    high: "severity-high",
  };

  const severityLabel: Record<string, string> = {
    none: t("healthy").split("!")[0].trim(),
    low: t("severityLow"),
    medium: t("severityMedium"),
    high: t("severityHigh"),
  };

  if (isHealthy) {
    return (
      <div className="kv-card bg-healthy-green-light border border-healthy-green/20 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
            <CheckCircle2 size={32} className="text-healthy-green" fill="currentColor" strokeWidth={0} />
          </div>
          <div className="flex-1">
            <p className="text-heading-sm font-bold text-healthy-green">{t("healthy")}</p>
            <p className="text-body-sm text-gray-600 mt-1">{t("healthyText")}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-caption font-medium text-gray-500">{t("cropLabel")}:</span>
              <span className="text-caption font-semibold text-gray-700">{displayCrop}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kv-card border border-disease-red/20 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-disease-red-light rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
          <AlertTriangle size={28} className="text-disease-red" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-caption font-semibold text-disease-red uppercase tracking-wide mb-1">
            {t("diseaseFound")}
          </p>
          <h3 className="text-heading-sm font-bold text-gray-900 leading-tight">{displayDisease}</h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-caption text-gray-500">{t("cropLabel")}:</span>
            <span className="text-caption font-semibold text-gray-700">{displayCrop}</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-4 flex items-center gap-3">
        {/* Confidence */}
        <div className="flex-1 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-1 mb-1">
            <Activity size={14} className="text-gray-400" />
            <span className="text-caption text-gray-500">Confidence</span>
          </div>
          <div className="text-heading-sm font-bold">
            <span className={confidenceColor}>{prediction.confidence.toFixed(1)}%</span>
          </div>
          <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                prediction.confidence >= 80 ? "bg-healthy-green" :
                prediction.confidence >= 60 ? "bg-harvest-gold" : "bg-disease-orange"
              )}
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>
        </div>

        {/* Severity */}
        <div className="flex-1 bg-gray-50 rounded-lg p-3">
          <div className="text-caption text-gray-500 mb-1">{t("severityLabel")}</div>
          <span className={severityClasses[prediction.severity]}>
            {severityLabel[prediction.severity]}
          </span>
        </div>
      </div>
    </div>
  );
}
