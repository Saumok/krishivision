import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SLUGS = [
  "apple-scab", "apple-black-rot", "apple-cedar-rust", "apple-healthy",
  "blueberry-healthy", "cherry-powdery-mildew", "cherry-healthy",
  "corn-cercospora", "corn-common-rust", "corn-northern-blight", "corn-healthy",
  "grape-black-rot", "grape-esca", "grape-leaf-blight", "grape-healthy",
  "orange-huanglongbing", "peach-bacterial-spot", "peach-healthy",
  "pepper-bacterial-spot", "pepper-healthy", "potato-early-blight",
  "potato-late-blight", "potato-healthy", "raspberry-healthy", "soybean-healthy",
  "squash-powdery-mildew", "strawberry-leaf-scorch", "strawberry-healthy",
  "tomato-bacterial-spot", "tomato-early-blight", "tomato-late-blight",
  "tomato-leaf-mold", "tomato-septoria", "tomato-spider-mites",
  "tomato-target-spot", "tomato-yellow-curl-virus", "tomato-mosaic-virus",
  "tomato-healthy"
];

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured on Vercel" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    if (!image) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    const prompt = `
      You are an expert plant pathologist. 
      Analyze this crop image. Identify the disease and return ONLY the MOST LIKELY matching slug from this EXACT list:
      [${SLUGS.join(", ")}].

      CRITICAL INSTRUCTIONS:
      1. You MUST pick ONE string from the array above. Do not invent new slugs.
      2. If the exact disease is not in the list, pick the 'healthy' slug for that specific crop (e.g., if it is corn smut, pick 'corn-healthy').
      3. If the crop is completely unknown, return 'tomato-healthy'.
      4. DO NOT output any other text, no markdown, no quotes, no explanation. Just the exact slug.
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: image,
          mimeType: "image/jpeg",
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text().toLowerCase().replace(/[^a-z0-9-]/g, ""); // Strip quotes, whitespace, punctuation
    
    // Find first matching slug
    let matchedSlug = SLUGS.find(s => s === text || text.includes(s));
    
    // Fallback logic if Gemini still hallucinates
    if (!matchedSlug) {
      // Try to find the crop name inside whatever text Gemini returned
      const crops = ["apple", "blueberry", "cherry", "corn", "grape", "orange", "peach", "pepper", "potato", "raspberry", "soybean", "squash", "strawberry", "tomato"];
      const detectedCrop = crops.find(c => text.includes(c));
      matchedSlug = detectedCrop ? `${detectedCrop}-healthy` : "corn-healthy";
    }

    return NextResponse.json({ slug: matchedSlug });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ 
      error: "Cloud analysis failed", 
      details: error.message || "Unknown error" 
    }, { status: 500 });
  }
}
