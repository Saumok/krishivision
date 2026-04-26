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
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    } catch {
      model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    }

    if (!image) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    const prompt = `
      You are an expert plant pathologist. 
      Analyze this crop image. Identify the disease and return ONLY the matching slug from this list:
      [${SLUGS.join(", ")}].
      Return NO other text. If unsure, return 'tomato-healthy'.
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
    const text = response.text().toLowerCase();
    
    // Find first matching slug in the response
    const matchedSlug = SLUGS.find(s => text.includes(s)) || "tomato-healthy";

    return NextResponse.json({ slug: matchedSlug });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ 
      error: "Cloud analysis failed", 
      details: error.message || "Unknown error" 
    }, { status: 500 });
  }
}
