import type { Vibe } from "@/types";

const IMAGEN_ENDPOINT = `https://aiplatform.googleapis.com/v1/publishers/google/models/imagen-3.0-generate-001:predict`;

const LOGO_STYLE_MAP: Record<Vibe, string> = {
  minimal: "flat vector, single color, geometric, ultra clean, no gradients",
  bold: "strong geometric shape, thick strokes, high contrast, bold typography",
  organic: "soft flowing shapes, hand-drawn feel, earthy warm tones, rounded edges",
  y2k: "chrome metallic, neon gradient, futuristic sharp shapes, glossy",
  dark: "dark mode icon, neon outline glow, sleek minimal shape, tech aesthetic",
  coastal: "clean nautical icon, ocean blue, simple wave or geometric shape, airy",
  retro: "vintage badge style, distressed texture, warm muted palette, retro shapes",
  custom: "",
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
  count: number = 4,
  customKeywords?: string
): Promise<LogoResult[]> {
  const styleDesc = vibe === "custom" && customKeywords
    ? customKeywords
    : LOGO_STYLE_MAP[vibe];

  const base = `logo mark for "${brandName}", ${styleDesc}, transparent background, isolated icon, no text, white canvas, professional`;

  const variations = [
    `Simple lettermark using initials of "${brandName}". ${styleDesc}. Transparent background, centered, no decorations.`,
    `Abstract icon symbol for "${brandName}". ${styleDesc}. Transparent background, single graphic element, no text.`,
    `Geometric badge logo for "${brandName}". ${styleDesc}. Transparent background, contained shape.`,
    `Minimal wordmark for "${brandName}". ${styleDesc}. Transparent background, typographic logo.`,
  ];

  const selected = variations.slice(0, count);
  const styles = ["lettermark", "icon", "badge", "wordmark"].slice(0, count);

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
