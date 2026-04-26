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
    const { image } = await req.json(); // base64 string without data:image/jpeg;base64,
    
    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY");
      return NextResponse.json({ error: "Cloud AI configuration missing" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert plant pathologist. 
      Analyze this crop image (could be a leaf, fruit, stem, or whole plant). 
      Identify the disease and map it to the MOST LIKELY slug from this list:
      [${SLUGS.join(", ")}].

      Rules:
      1. If the plant is NOT in the list (like a mango), still try to find the closest matching disease category or return "tomato-healthy" if it looks fine.
      2. If it is clearly a specific disease from the list (like Tomato Late Blight on a fruit), return that matching slug.
      3. Return ONLY the slug name from the list. No other text, no explanation.
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
    const text = response.text().trim().toLowerCase();
    
    // Validate that the returned text is one of our slugs
    const matchedSlug = SLUGS.find(s => text.includes(s)) || "tomato-healthy";

    return NextResponse.json({ slug: matchedSlug });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to analyze image in cloud" }, { status: 500 });
  }
}
