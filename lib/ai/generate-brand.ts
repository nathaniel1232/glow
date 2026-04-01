import type { Vibe, GenerationResult } from "@/types";

// Vertex AI Express endpoint — no project/region needed, just API key
function getVertexEndpoint(): string {
  const apiKey = process.env.GCP_API_KEY!;
  return `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;
}

const VIBE_DESCRIPTIONS: Record<Vibe, string> = {
  minimal: "Clean, whitespace-heavy, Swiss design inspired. Muted colors, sans-serif fonts, grid-based layouts.",
  bold: "High contrast, large type, strong colors. Confident and attention-grabbing.",
  organic: "Natural textures, earthy tones, handwritten elements. Warm and approachable.",
  y2k: "Futuristic, chrome effects, bright neons, early 2000s tech aesthetic.",
  dark: "Dark backgrounds, neon accents, sophisticated and moody. Tech-forward.",
  coastal: "Ocean-inspired blues and whites, relaxed, airy. Clean and fresh.",
  retro: "Vintage typography, warm palettes, nostalgic. 70s/80s inspired textures.",
};

const GOOGLE_FONT_PAIRS: Record<Vibe, { heading: string; body: string }[]> = {
  minimal: [
    { heading: "Space Grotesk", body: "Inter" },
    { heading: "DM Sans", body: "IBM Plex Sans" },
    { heading: "Outfit", body: "Source Sans 3" },
  ],
  bold: [
    { heading: "Syne", body: "Work Sans" },
    { heading: "Archivo Black", body: "DM Sans" },
    { heading: "Bebas Neue", body: "Inter" },
  ],
  organic: [
    { heading: "Fraunces", body: "Lora" },
    { heading: "Playfair Display", body: "Source Serif 4" },
    { heading: "DM Serif Display", body: "Nunito" },
  ],
  y2k: [
    { heading: "Orbitron", body: "Exo 2" },
    { heading: "Rajdhani", body: "Space Mono" },
    { heading: "Audiowide", body: "Share Tech" },
  ],
  dark: [
    { heading: "JetBrains Mono", body: "Inter" },
    { heading: "Space Grotesk", body: "Fira Code" },
    { heading: "Syne Mono", body: "DM Mono" },
  ],
  coastal: [
    { heading: "Cormorant Garamond", body: "Lato" },
    { heading: "Libre Baskerville", body: "Open Sans" },
    { heading: "Josefin Sans", body: "Poppins" },
  ],
  retro: [
    { heading: "Abril Fatface", body: "Roboto Slab" },
    { heading: "Righteous", body: "Karla" },
    { heading: "Lobster Two", body: "Merriweather" },
  ],
};

export async function generateBrand(
  description: string,
  vibe: Vibe
): Promise<GenerationResult> {
  const fontOptions = GOOGLE_FONT_PAIRS[vibe];
  const selectedFonts = fontOptions[Math.floor(Math.random() * fontOptions.length)];

  const prompt = `You are a world-class brand strategist and designer. Generate a complete brand identity based on the following:

Business description: "${description}"
Design vibe: ${vibe} -- ${VIBE_DESCRIPTIONS[vibe]}

Return a JSON object with EXACTLY this structure (no markdown, no code blocks, just raw JSON):
{
  "brand_names": ["name1", "name2", "name3"],
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "text": "#hex",
    "usage": {
      "primary": "When to use this color",
      "secondary": "When to use this color",
      "accent": "When to use this color",
      "background": "When to use this color",
      "text": "When to use this color"
    }
  },
  "voice": {
    "tone": "2-3 word description of brand voice tone",
    "tagline": "A memorable tagline for the brand",
    "description": "2-3 sentences describing the brand personality and communication style",
    "keywords": ["word1", "word2", "word3", "word4", "word5"]
  },
  "social_templates": [
    {
      "type": "instagram",
      "headline": "Short punchy headline for IG post",
      "subtext": "Supporting text"
    },
    {
      "type": "twitter",
      "headline": "Tweet-length headline",
      "subtext": "Thread-style follow-up"
    },
    {
      "type": "linkedin",
      "headline": "Professional headline",
      "subtext": "Professional supporting text"
    }
  ]
}

Rules:
- Brand names must feel like real startup/brand names humans would actually invent — think Notion, Vercel, Arc, Stripe, Loom, Figma, Oura, Linear, Fathom. NOT generic compound words like "BrandFlow", "CreativeHub", "SmartVibe". Use invented words, short evocative real words, unexpected metaphors, or single strong words. Max 2 syllables preferred. Be bold and surprising.
- Colors must be harmonious and match the ${vibe} vibe exactly
- The tagline should be punchy and specific to this exact brand — never generic buzzwords like "empower", "transform", "revolutionize", or "seamless"
- Social templates should feel like a real human wrote them for this specific brand, not AI filler text
- All hex codes must be valid 6-character hex colors`;

  try {
    const response = await fetch(getVertexEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Vertex AI error:", error);
      throw new Error(`Vertex AI API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract text from Vertex AI response
    const text = data.candidates[0]?.content?.parts[0]?.text;
    if (!text) {
      throw new Error("No response from Vertex AI");
    }

    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      brand_names: parsed.brand_names,
      colors: parsed.colors,
      fonts: {
        heading: selectedFonts.heading,
        body: selectedFonts.body,
        headingUrl: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(selectedFonts.heading)}:wght@400;500;600;700&display=swap`,
        bodyUrl: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(selectedFonts.body)}:wght@300;400;500;600&display=swap`,
      },
      voice: parsed.voice,
      social_templates: parsed.social_templates,
    };
  } catch (error) {
    console.error("Brand generation error:", error);
    throw error;
  }
}
