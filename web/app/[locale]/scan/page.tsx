"use client";
import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ScanLine, AlertCircle, RefreshCw, Upload, CheckCircle2, ChevronRight, AlertTriangle } from "lucide-react";
import CameraView from "@/components/scan/CameraView";
import DiagnosisCard from "@/components/scan/DiagnosisCard";
import RemedyCard from "@/components/scan/RemedyCard";
import BottomNav from "@/components/layout/BottomNav";
import { runInference, fileToImageElement, type InferenceResult } from "@/lib/model";
import { runCloudInference } from "@/lib/cloudModel";
import { compressImage } from "@/lib/image-utils";
import { createClient } from "@/lib/supabase/client";
import { EXPERT_WHATSAPP, EXPERT_PHONE } from "@/lib/utils";
import { toast } from "sonner";
import { uploadScanImage } from "@/lib/image-utils";

type ScanState = "camera" | "preview" | "analyzing" | "cloud-analyzing" | "result" | "low-confidence";

export default function ScanPage() {
  const t = useTranslations("scan");
  const td = useTranslations("diagnosis");
  const te = useTranslations("expert");
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const supabase = createClient();

  const [state, setState] = useState<ScanState>("camera");
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<InferenceResult | null>(null);
  const [remedy, setRemedy] = useState<any>(null);
  const [localizedNames, setLocalizedNames] = useState<{ disease?: string; crop?: string }>({});
  const [analyzingProgress, setAnalyzingProgress] = useState(0);

  const handleCapture = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setCapturedFile(file);
    setPreviewUrl(url);
    setState("preview");
  }, []);

  const handleAnalyze = async () => {
    if (!capturedFile) return;
    setState("analyzing");

    // Animate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress = Math.min(progress + 10, 85);
      setAnalyzingProgress(progress);
    }, 200);

    try {
      // Compress image
      const compressed = await compressImage(capturedFile);

      // Run TF.js inference
      const imgEl = await fileToImageElement(compressed);
      const inferenceResult = await runInference(imgEl);

      clearInterval(progressInterval);
      setAnalyzingProgress(100);
      setResult(inferenceResult);

      if (inferenceResult.isLowConfidence) {
        setState("low-confidence");
        return;
      }

      // Fetch from Supabase if not healthy
      if (!inferenceResult.topPrediction.isHealthy) {
        await fetchRemedy(inferenceResult.topPrediction.slug, locale);
      }

      // Log scan (async, non-blocking)
      logScan(inferenceResult, compressed).catch(console.error);

      setState("result");
    } catch (err: any) {
      clearInterval(progressInterval);
      toast.error(t("noModelText"));
      setState("camera");
    }
  };

  const handleCloudAnalyze = async () => {
    if (!capturedFile) return;
    setState("cloud-analyzing");

    try {
      const compressed = await compressImage(capturedFile);
      const imgEl = await fileToImageElement(compressed);
      
      const inferenceResult = await runCloudInference(imgEl);
      
      setResult(inferenceResult);
      
      if (!inferenceResult.topPrediction.isHealthy) {
        await fetchRemedy(inferenceResult.topPrediction.slug, locale);
      }

      logScan(inferenceResult, compressed).catch(console.error);
      setState("result");
    } catch (err: any) {
      console.error(err);
      toast.error("Cloud analysis failed. Using offline model instead.");
      handleAnalyze();
    }
  };

  const fetchRemedy = async (diseaseSlug: string, lang: string) => {
    // First, get disease by slug
    const { data: disease } = await supabase
      .from("diseases")
      .select("id, name_en, crop_en")
      .eq("slug", diseaseSlug)
      .single();

    if (disease) {
      setLocalizedNames({
        disease: disease.name_en,
        crop: disease.crop_en,
      });

      // Fetch remedy for this disease + locale
      const { data: remedyData } = await supabase
        .from("verified_remedies")
        .select("treatment, organic_alternative, prevention, source")
        .eq("disease_id", disease.id)
        .eq("language", lang)
        .single();

      if (!remedyData) {
        // Fallback to English
        const { data: enRemedy } = await supabase
          .from("verified_remedies")
          .select("treatment, organic_alternative, prevention, source")
          .eq("disease_id", disease.id)
          .eq("language", "en")
          .single();
        setRemedy(enRemedy);
      } else {
        setRemedy(remedyData);
      }
    }
  };

  const logScan = async (inferenceResult: InferenceResult, file: File) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let imageUrl;
    try {
      imageUrl = await uploadScanImage(supabase, file, user.id);
    } catch { /* ignore upload errors */ }

    await supabase.from("scans").insert({
      user_id: user.id,
      image_url: imageUrl,
      disease_slug: inferenceResult.topPrediction.slug,
      disease_name: inferenceResult.topPrediction.diseaseEn,
      crop_name: inferenceResult.topPrediction.cropEn,
      confidence: inferenceResult.topPrediction.confidence / 100,
      top3: inferenceResult.top3,
      is_low_confidence: inferenceResult.isLowConfidence,
    });
  };

  const handleRetake = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setCapturedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setRemedy(null);
    setState("camera");
  };

  return (
    <div className="page-shell">
      <AnimatePresence mode="wait">
        {/* CAMERA STATE */}
        {state === "camera" && (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="bg-agri-green-dark px-4 py-4">
              <h1 className="text-heading-sm font-bold text-white">{t("title")}</h1>
            </div>
            <CameraView onCapture={handleCapture} />
          </motion.div>
        )}

        {/* PREVIEW STATE */}
        {state === "preview" && previewUrl && (
          <motion.div
            key="preview"
            className="flex flex-col"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          >
            <div className="bg-agri-green-dark px-4 py-4">
              <h1 className="text-heading-sm font-bold text-white">{t("preview")}</h1>
            </div>
            <img src={previewUrl} alt="preview" className="w-full aspect-[4/3] object-cover" />
            <div className="bg-orange-50/50 border border-orange-200 m-4 p-3 rounded-lg flex items-start gap-3">
              <AlertTriangle size={20} className="text-orange-500 shrink-0 mt-0.5" />
              <p className="text-body-sm text-gray-700">
                <strong className="text-gray-900 block">{t("cloudWarningTitle") || "Scan Leaves, Not Fruits!"}</strong>
                {t("cloudWarningText") || "Our Krishi AI is trained on 87,000 images of diseased leaves. Scanning fruits or stems may be less accurate."}
              </p>
            </div>
            <div className="px-4 pb-8 space-y-3">
              <button id="analyze-btn" onClick={handleAnalyze} className="btn-primary w-full">
                <ScanLine size={22} /> {t("capture")}
              </button>
              
              <button id="cloud-analyze-btn" onClick={handleCloudAnalyze} className="btn-secondary w-full border-agri-green/30 text-agri-green bg-agri-green/5">
                ☁️ {t("cloudCta") || "Analyze via Cloud AI"}
              </button>

              <button id="retake-btn" onClick={handleRetake} className="btn-ghost w-full">
                {t("retake")}
              </button>
            </div>
          </motion.div>
        )}

        {/* ANALYZING STATE */}
        {(state === "analyzing" || state === "cloud-analyzing") && (
          <motion.div
            key="analyzing"
            className="flex flex-col items-center justify-center min-h-screen gap-8 p-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="relative w-36 h-36">
              <div className="absolute inset-0 rounded-full border-4 border-agri-green-muted opacity-20" />
              <div
                className="absolute inset-0 rounded-full border-4 border-agri-green border-t-transparent animate-spin"
                style={{ animationDuration: state === "cloud-analyzing" ? "0.8s" : "1.2s" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">{state === "cloud-analyzing" ? "☁️" : "🔬"}</span>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-heading-sm font-bold text-gray-800">
                {state === "cloud-analyzing" ? "Cloud AI is thinking..." : t("analyzing")}
              </h2>
              <p className="text-body-sm text-gray-500 mt-1">
                {state === "cloud-analyzing" ? "Connecting to advanced agricultural brain" : t("analyzingSubtitle")}
              </p>
            </div>
            {state === "analyzing" && (
              <div className="w-full max-w-xs">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-agri-green rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${analyzingProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-center text-caption text-gray-400 mt-2">{analyzingProgress}%</p>
              </div>
            )}
          </motion.div>
        )}

        {/* RESULT STATE */}
        {state === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          >
            <div className="bg-agri-green-dark px-4 py-4">
              <h1 className="text-heading-sm font-bold text-white">{t("resultTitle")}</h1>
            </div>

            <div className="page-content flex flex-col gap-4">
              {/* Scanned image thumbnail */}
              {previewUrl && (
                <div className="w-full h-48 rounded-card overflow-hidden bg-gray-100">
                  <img src={previewUrl} alt="scanned" className="w-full h-full object-cover" />
                </div>
              )}

              <DiagnosisCard
                prediction={result.topPrediction}
                localizedDiseaseName={localizedNames.disease}
                localizedCropName={localizedNames.crop}
              />

              {!result.topPrediction.isHealthy && (
                <RemedyCard
                  remedy={remedy}
                  diseaseName={localizedNames.disease ?? result.topPrediction.diseaseEn}
                />
              )}

              {/* Actions */}
              <button id="new-scan-btn" onClick={handleRetake} className="btn-secondary w-full">
                📷 {t("newScan")}
              </button>
            </div>
          </motion.div>
        )}

        {/* LOW CONFIDENCE STATE */}
        {state === "low-confidence" && (
          <motion.div
            key="low-confidence"
            className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="w-24 h-24 bg-disease-yellow-light rounded-full flex items-center justify-center">
              <AlertTriangle size={44} className="text-disease-yellow" />
            </div>
            <div>
              <h2 className="text-heading-sm font-bold text-gray-800">{t("lowConfidenceTitle")}</h2>
              <p className="text-body-sm text-gray-500 mt-2">{t("lowConfidenceText")}</p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button onClick={handleCloudAnalyze} className="btn-primary bg-agri-blue hover:bg-agri-blue-dark">
                 ☁️ {t("tryCloudCta") || "Try Advanced Cloud AI"}
              </button>
              <div className="flex gap-2">
                <a href={`tel:${EXPERT_PHONE}`} className="btn-secondary flex-1">
                  <Phone size={18} /> {te("callNow")}
                </a>
                <a href={EXPERT_WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1">
                  <MessageCircle size={18} /> WhatsApp
                </a>
              </div>
              <button onClick={handleRetake} className="btn-ghost">
                📷 {t("newScan")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(state === "result" || state === "low-confidence") && (
        <BottomNav locale={locale} />
      )}
    </div>
  );
}
