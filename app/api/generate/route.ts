import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateBrand } from "@/lib/ai/generate-brand";
import { generateLogos } from "@/lib/ai/generate-logos";
import { saveBrandProject } from "@/lib/db";
import type { Vibe } from "@/types";

const VALID_VIBES: Vibe[] = ["minimal", "bold", "organic", "y2k", "dark", "coastal", "retro", "custom"];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { description, vibe, customKeywords } = body;

    if (!description || typeof description !== "string" || description.trim().length < 3) {
      return NextResponse.json(
        { error: "Please provide a valid business description" },
        { status: 400 }
      );
    }

    if (!vibe || !VALID_VIBES.includes(vibe)) {
      return NextResponse.json(
        { error: "Please select a valid vibe" },
        { status: 400 }
      );
    }

    if (vibe === "custom" && (!customKeywords || typeof customKeywords !== "string" || customKeywords.trim().length < 2)) {
      return NextResponse.json(
        { error: "Please add some style keywords for the custom vibe" },
        { status: 400 }
      );
    }

    const sanitizedDescription = description.trim().slice(0, 500);
    const sanitizedKeywords = vibe === "custom" ? (customKeywords as string).trim().slice(0, 200) : undefined;

    // Generate brand strategy via Gemini
    const brandResult = await generateBrand(sanitizedDescription, vibe, sanitizedKeywords);

    // Generate logos via Imagen 3 (Vertex AI Express)
    const primaryName = brandResult.brand_names[0] || "Brand";
    const logos = await generateLogos(primaryName, vibe, 4, sanitizedKeywords);

    // Save project with logo data URLs directly
    const project = await saveBrandProject(user.id, {
      name: primaryName,
      description: sanitizedDescription,
      vibe,
      brand_names: brandResult.brand_names,
      colors: brandResult.colors,
      fonts: brandResult.fonts,
      voice: brandResult.voice,
      logos: logos.map((l) => ({ url: l.url, style: l.style })),
      social_templates: brandResult.social_templates,
    });

    return NextResponse.json({
      id: project.id,
      ...brandResult,
      logos: logos.map((l) => ({ url: l.url, style: l.style })),
    });
  } catch (error) {
    console.error("Brand generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate brand. Please try again." },
      { status: 500 }
    );
  }
}
