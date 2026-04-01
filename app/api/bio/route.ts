import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateBioLinks } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, slug, links } = await request.json();

    if (!projectId || typeof projectId !== "string") {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    if (!slug || typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
        { status: 400 }
      );
    }

    if (!Array.isArray(links) || links.length > 20) {
      return NextResponse.json({ error: "Invalid links" }, { status: 400 });
    }

    // Validate ownership
    const { data: project } = await supabase
      .from("brand_projects")
      .select("user_id")
      .eq("id", projectId)
      .single();

    if (!project || project.user_id !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from("brand_projects")
      .select("id")
      .eq("bio_slug", slug)
      .neq("id", projectId)
      .single();

    if (existing) {
      return NextResponse.json({ error: "This slug is already taken" }, { status: 409 });
    }

    const sanitizedLinks = links.map((l: { label: string; url: string }) => ({
      label: String(l.label).slice(0, 100),
      url: String(l.url).slice(0, 500),
    }));

    await updateBioLinks(projectId, slug, sanitizedLinks);

    return NextResponse.json({ slug, url: `/bio/${slug}` });
  } catch (error) {
    console.error("Bio update error:", error);
    return NextResponse.json(
      { error: "Failed to update bio" },
      { status: 500 }
    );
  }
}
