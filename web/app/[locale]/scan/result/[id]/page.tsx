"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import DiagnosisCard from "@/components/scan/DiagnosisCard";
import RemedyCard from "@/components/scan/RemedyCard";
import BottomNav from "@/components/layout/BottomNav";
import { toast } from "sonner";

export default function ScanResultPage() {
  const t = useTranslations("scan");
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const scanId = params.id as string;
  const supabase = createClient();

  const [scan, setScan] = useState<any>(null);
  const [remedy, setRemedy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScanDetails();
  }, [scanId]);

  const fetchScanDetails = async () => {
    setLoading(true);
    const { data: scanData, error: scanError } = await supabase
      .from("scans")
      .select("*")
      .eq("id", scanId)
      .single();

    if (scanError || !scanData) {
      toast.error("Scan not found");
      router.push(`/${locale}`);
      return;
    }

    setScan(scanData);

    // Fetch disease and remedy if not healthy
    if (scanData.disease_slug && !scanData.disease_slug.includes("healthy")) {
      const { data: disease } = await supabase
        .from("diseases")
        .select("id")
        .eq("slug", scanData.disease_slug)
        .single();

      if (disease) {
        const { data: remedyData } = await supabase
          .from("verified_remedies")
          .select("*")
          .eq("disease_id", disease.id)
          .eq("language", locale)
          .single();

        if (remedyData) {
          setRemedy(remedyData);
        } else {
          // Fallback to English
          const { data: enRemedy } = await supabase
            .from("verified_remedies")
            .select("*")
            .eq("disease_id", disease.id)
            .eq("language", "en")
            .single();
          setRemedy(enRemedy);
        }
      }
    }
    setLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "KrishiVision Diagnosis",
        text: `My ${scan?.crop_name} plant has ${scan?.disease_name}. Check out KrishiVision!`,
        url: window.location.href,
      });
    } else {
      toast.info("Sharing not supported on this browser");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-agri-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="hero-header flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white">
          <ArrowLeft size={20} /> Back
        </button>
        <button onClick={handleShare} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Share2 size={20} />
        </button>
      </div>

      <div className="page-content flex flex-col gap-4">
        {scan.image_url && (
          <div className="w-full h-64 rounded-card overflow-hidden bg-gray-100">
            <img src={scan.image_url} alt="Scan" className="w-full h-full object-cover" />
          </div>
        )}

        <DiagnosisCard
          prediction={{
            index: 0,
            slug: scan.disease_slug,
            cropEn: scan.crop_name,
            diseaseEn: scan.disease_name,
            isHealthy: scan.disease_slug.includes("healthy"),
            severity: "medium", // Default or fetch from disease table
            confidence: scan.confidence * 100,
          }}
        />

        {remedy && (
          <RemedyCard
            remedy={remedy}
            diseaseName={scan.disease_name}
          />
        )}
      </div>

      <BottomNav locale={locale} />
    </div>
  );
}
