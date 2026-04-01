import type { Vibe } from "@/types";

const IMAGEN_ENDPOINT = `https://aiplatform.googleapis.com/v1/publishers/google/models/imagen-3.0-generate-001:predict`;

const LOGO_STYLE_MAP: Record<Vibe, string> = {
  minimal: "minimalist vector logo, clean lines, geometric, single color, white background, professional, modern",
  bold: "bold graphic logo, strong typography, high contrast, vibrant colors, white background, impactful, modern",
  organic: "organic hand-drawn logo, natural textures, earthy tones, flowing lines, white background, artisan feel",
  y2k: "futuristic logo, chrome effect, metallic sheen, neon glow, cyber aesthetic, white background",
  dark: "sleek logo, neon accents, cyberpunk, sophisticated, dark tech aesthetic, white background",
  coastal: "coastal logo, ocean blue palette, clean, nautical elements, white background, fresh and airy",
  retro: "retro vintage logo, 70s style, warm colors, nostalgic badge style, vintage typography, white background",
};

interface LogoResult {
  url: string;
  style: string;
}

async function generateSingleLogo(prompt: string): Promise<string> {
  const apiKey = process.env.GCP_API_KEY!;
  const response = await fetch(`${IMAGEN_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "1:1",
        safetyFilterLevel: "block_few",
        personGeneration: "dont_allow",
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Imagen error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const b64 = data.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) throw new Error("No image data returned");
  return `data:image/png;base64,${b64}`;
}

export async function generateLogos(
  brandName: string,
  vibe: Vibe,
  count: number = 4
): Promise<LogoResult[]> {
  const baseStyle = LOGO_STYLE_MAP[vibe];
  const variations = [
    `Lettermark logo for brand "${brandName}". ${baseStyle}. Isolated on white background, no text except the brand initials.`,
    `Wordmark logo for brand "${brandName}". ${baseStyle}. Clean typographic treatment of the full brand name.`,
    `Abstract icon/symbol for brand "${brandName}". ${baseStyle}. No text, pure icon mark.`,
    `Combination logo mark for brand "${brandName}". ${baseStyle}. Icon paired with brand name.`,
  ];

  const selected = variations.slice(0, count);
  const styles = ["lettermark", "wordmark", "icon", "combination"].slice(0, count);

  const results = await Promise.allSettled(
    selected.map((prompt) => generateSingleLogo(prompt))
  );

  return results
    .map((result, index) => {
      if (result.status === "fulfilled") {
        return { url: result.value, style: styles[index] };
      }
      console.error(`Logo generation failed for style ${styles[index]}:`, result.reason);
      return null;
    })
    .filter((r): r is LogoResult => r !== null);
}
