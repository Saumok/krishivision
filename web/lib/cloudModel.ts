import { getClassBySlug } from "./classLabels";
import { InferenceResult, Prediction } from "./model";

export async function runCloudInference(imageElement: HTMLImageElement | HTMLCanvasElement): Promise<InferenceResult> {
  // Downscale image to max 1024px to prevent hitting Vercel 4.5MB limit
  const MAX_DIM = 1024;
  let width = imageElement instanceof HTMLImageElement ? imageElement.naturalWidth : imageElement.width;
  let height = imageElement instanceof HTMLImageElement ? imageElement.naturalHeight : imageElement.height;
  
  if (width > MAX_DIM || height > MAX_DIM) {
    if (width > height) {
      height = (height / width) * MAX_DIM;
      width = MAX_DIM;
    } else {
      width = (width / height) * MAX_DIM;
      height = MAX_DIM;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  ctx.drawImage(imageElement, 0, 0, width, height);
  
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
