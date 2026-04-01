import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateBrand } from "@/lib/ai/generate-brand";
import { generateLogos } from "@/lib/ai/generate-logos";
import { saveBrandProject, uploadLogoToStorage } from "@/lib/db";
import type { Vibe } from "@/types";

const VALID_VIBES: Vibe[] = ["minimal", "bold", "organic", "y2k", "dark", "coastal", "retro"];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { description, vibe } = body;

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

    const sanitizedDescription = description.trim().slice(0, 500);

    // Generate brand strategy via Gemini
    const brandResult = await generateBrand(sanitizedDescription, vibe);

    // Generate logos via Replicate
    const primaryName = brandResult.brand_names[0] || "Brand";
    const logos = await generateLogos(primaryName, vibe, 4);

    // Save project first to get ID
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

    // Upload logos to Supabase storage (fire and don't block response)
    const uploadPromises = logos.map((logo, i) =>
      uploadLogoToStorage(user.id, project.id, logo.url, i).catch((err) => {
        console.error(`Logo upload failed for index ${i}:`, err);
        return logo.url;
      })
    );

    const storedUrls = await Promise.all(uploadPromises);
    
    // Update project with stored URLs
    const updatedLogos = logos.map((logo, i) => ({
      url: storedUrls[i],
      style: logo.style,
    }));

    const { error: updateError } = await (await createClient())
      .from("brand_projects")
      .update({ logos: updatedLogos })
      .eq("id", project.id);

    if (updateError) {
      console.error("Failed to update logo URLs:", updateError);
    }

    return NextResponse.json({
      id: project.id,
      ...brandResult,
      logos: updatedLogos,
    });
  } catch (error) {
    console.error("Brand generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate brand. Please try again." },
      { status: 500 }
    );
  }
}
