import Replicate from "replicate";
import type { Vibe } from "@/types";

function getReplicate() {
  return new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!,
  });
}

const LOGO_STYLE_MAP: Record<Vibe, string> = {
  minimal: "minimalist vector logo, clean lines, geometric, single color, white background, professional, modern, svg style",
  bold: "bold graphic logo, strong typography, high contrast, vibrant colors, white background, impactful, modern",
  organic: "organic hand-drawn logo, natural textures, earthy colors, flowing lines, white background, artisan feel",
  y2k: "futuristic logo, chrome effect, metallic, neon glow, cyber aesthetic, white background, tech style",
  dark: "sleek dark logo, neon accents, cyberpunk, sophisticated, moody lighting, dark tech aesthetic, white background",
  coastal: "coastal inspired logo, ocean blue, clean, waves, nautical elements, white background, fresh and airy",
  retro: "retro vintage logo, 70s style, warm colors, nostalgic, badge style, vintage typography, white background",
};

interface LogoResult {
  url: string;
  style: string;
}

export async function generateLogos(
  brandName: string,
  vibe: Vibe,
  count: number = 4
): Promise<LogoResult[]> {
  const baseStyle = LOGO_STYLE_MAP[vibe];
  const variations = [
    `Lettermark logo for "${brandName}": ${baseStyle}`,
    `Wordmark logo for "${brandName}": ${baseStyle}`,
    `Icon/symbol logo for "${brandName}": ${baseStyle}`,
    `Combination mark logo for "${brandName}": ${baseStyle}`,
  ];

  const selected = variations.slice(0, count);
  const styles = ["lettermark", "wordmark", "icon", "combination"].slice(0, count);

  const results = await Promise.allSettled(
    selected.map(async (prompt) => {
      const output = await getReplicate().run("black-forest-labs/flux-1.1-pro", {
        input: {
          prompt,
          width: 1024,
          height: 1024,
          num_outputs: 1,
          output_format: "webp",
          output_quality: 90,
        },
      });

      if (Array.isArray(output) && output.length > 0) {
        const item = output[0];
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "url" in item) return (item as { url: () => string }).url();
        return String(item);
      }
      if (typeof output === "string") return output;
      if (output && typeof output === "object" && "url" in output) return (output as { url: () => string }).url();
      return String(output);
    })
  );

  return results
    .map((result, index) => {
      if (result.status === "fulfilled") {
        return {
          url: result.value,
          style: styles[index],
        };
      }
      console.error(`Logo generation failed for style ${styles[index]}:`, result.reason);
      return null;
    })
    .filter((r): r is LogoResult => r !== null);
}
