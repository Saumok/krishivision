import { getClassBySlug } from "./classLabels";
import { InferenceResult, Prediction } from "./model";

export async function runCloudInference(imageElement: HTMLImageElement | HTMLCanvasElement): Promise<InferenceResult> {
  // Convert image to base64
  const canvas = document.createElement("canvas");
  canvas.width = imageElement instanceof HTMLImageElement ? imageElement.naturalWidth : imageElement.width;
  canvas.height = imageElement instanceof HTMLImageElement ? imageElement.naturalHeight : imageElement.height;
  
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  ctx.drawImage(imageElement, 0, 0);
  
  // Get base64 string
  const base64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64 }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Cloud analysis failed");
  }

  const { slug } = await response.json();
  const cls = getClassBySlug(slug);

  if (!cls) throw new Error(`Model returned unknown slug: ${slug}`);

  const topPrediction: Prediction = {
    index: cls.index,
    slug: cls.slug,
    cropEn: cls.cropEn,
    diseaseEn: cls.diseaseEn,
    isHealthy: cls.isHealthy,
    severity: cls.severity,
    confidence: 100, // Gemini is usually confident if it picks a slug
  };

  return {
    topPrediction,
    top3: [topPrediction],
    isLowConfidence: false,
  };
}
