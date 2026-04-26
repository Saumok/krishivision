"use client";
/**
 * TensorFlow.js plant disease inference engine.
 * Model runs 100% in the browser — no server needed.
 * Model files must be placed in /public/model/ after training.
 */

import { getClassByIndex } from "./classLabels";

const MODEL_URL = `/model/model.json?v=2`;
const INPUT_SIZE = 224;
const CONFIDENCE_THRESHOLD = 0.60;
const TOP_K = 3;

export interface Prediction {
  index: number;
  slug: string;
  cropEn: string;
  diseaseEn: string;
  isHealthy: boolean;
  severity: "none" | "low" | "medium" | "high";
  confidence: number;
}

export interface InferenceResult {
  topPrediction: Prediction;
  top3: Prediction[];
  isLowConfidence: boolean;
}

let modelInstance: import("@tensorflow/tfjs").LayersModel | null = null;
let isLoading = false;

async function loadTfjs() {
  const tf = await import("@tensorflow/tfjs");
  // Try WebGL first, fall back to WASM, then CPU
  try {
    await tf.setBackend("webgl");
  } catch {
    try {
      await tf.setBackend("wasm");
    } catch {
      await tf.setBackend("cpu");
    }
  }
  await tf.ready();
  return tf;
}

export async function loadModel(): Promise<void> {
  if (modelInstance || isLoading) return;
  isLoading = true;
  try {
    const tf = await loadTfjs();
    const modelUrl = `/model/model.json?v=3`;
    console.log("[KrishiVision] Loading model from", modelUrl);
    modelInstance = await tf.loadLayersModel(modelUrl);
    // Warm up with a dummy tensor
    const dummy = tf.zeros([1, INPUT_SIZE, INPUT_SIZE, 3]);
    const warm = modelInstance.predict(dummy) as import("@tensorflow/tfjs").Tensor;
    warm.dispose();
    dummy.dispose();
    console.log("[KrishiVision] Model loaded and warmed up.");
  } catch (err) {
    console.error("[KrishiVision] Failed to load model:", err);
    throw err;
  } finally {
    isLoading = false;
  }
}

export function isModelLoaded(): boolean {
  return modelInstance !== null;
}

async function preprocessImage(imageElement: HTMLImageElement | HTMLCanvasElement): Promise<import("@tensorflow/tfjs").Tensor4D> {
  const tf = await loadTfjs();
  return tf.tidy(() => {
    const img = tf.browser.fromPixels(imageElement);
    const resized = tf.image.resizeBilinear(img, [INPUT_SIZE, INPUT_SIZE]);
    const normalized = resized.div(255.0);
    return normalized.expandDims(0) as import("@tensorflow/tfjs").Tensor4D;
  });
}

export async function runInference(imageElement: HTMLImageElement | HTMLCanvasElement): Promise<InferenceResult> {
  if (!modelInstance) {
    await loadModel();
  }
  if (!modelInstance) throw new Error("Model failed to load.");

  const tf = await loadTfjs();
  const inputTensor = await preprocessImage(imageElement);

  let predictions: number[];
  try {
    const output = modelInstance.predict(inputTensor) as import("@tensorflow/tfjs").Tensor;
    predictions = Array.from(await output.data());
    output.dispose();
  } finally {
    inputTensor.dispose();
  }

  // Get top-K indices
  const indexed = predictions.map((score, idx) => ({ idx, score }));
  indexed.sort((a, b) => b.score - a.score);
  const topK = indexed.slice(0, TOP_K);

  const top3: Prediction[] = topK.map(({ idx, score }) => {
    const cls = getClassByIndex(idx);
    return {
      index: idx,
      slug: cls?.slug ?? `unknown-${idx}`,
      cropEn: cls?.cropEn ?? "Unknown",
      diseaseEn: cls?.diseaseEn ?? "Unknown",
      isHealthy: cls?.isHealthy ?? false,
      severity: cls?.severity ?? "medium",
      confidence: Math.round(score * 1000) / 10, // e.g. 0.876 → 87.6
    };
  });

  const topPrediction = top3[0];
  const isLowConfidence = topPrediction.confidence < CONFIDENCE_THRESHOLD * 100;

  return { topPrediction, top3, isLowConfidence };
}

/** Convert a File/Blob to an HTMLImageElement for TF.js */
export function fileToImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}
