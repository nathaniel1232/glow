import { createClient } from "@/lib/supabase/server";
import type { BrandProject, LogoAsset } from "@/types";

export async function saveBrandProject(
  userId: string,
  data: Omit<BrandProject, "id" | "user_id" | "created_at" | "updated_at" | "is_paid" | "bio_slug" | "bio_links">
): Promise<BrandProject> {
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("brand_projects")
    .insert({
      user_id: userId,
      name: data.name,
      description: data.description,
      vibe: data.vibe,
      brand_names: data.brand_names,
      colors: data.colors,
      fonts: data.fonts,
      voice: data.voice,
      logos: data.logos,
      social_templates: data.social_templates,
      bio_slug: null,
      bio_links: [],
      is_paid: false,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to save project: ${error.message}`);
  return project as BrandProject;
}

export async function getBrandProject(id: string): Promise<BrandProject | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brand_projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as BrandProject;
}

export async function getUserProjects(userId: string): Promise<BrandProject[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brand_projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch projects: ${error.message}`);
  return (data || []) as BrandProject[];
}

export async function updateProjectPayment(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("brand_projects")
    .update({ is_paid: true })
    .eq("id", id);

  if (error) throw new Error(`Failed to update payment: ${error.message}`);
}

export async function updateBioLinks(
  id: string,
  slug: string,
  links: { label: string; url: string }[]
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("brand_projects")
    .update({ bio_slug: slug, bio_links: links })
    .eq("id", id);

  if (error) throw new Error(`Failed to update bio: ${error.message}`);
}

export async function getProjectBySlug(slug: string): Promise<BrandProject | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brand_projects")
    .select("*")
    .eq("bio_slug", slug)
    .single();

  if (error) return null;
  return data as BrandProject;
}

export async function uploadLogoToStorage(
  userId: string,
  projectId: string,
  logoUrl: string,
  index: number
): Promise<string> {
  const supabase = await createClient();
  
  const response = await fetch(logoUrl);
  const blob = await response.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());
  
  const path = `${userId}/${projectId}/logo-${index}.webp`;
  
  const { error } = await supabase.storage
    .from("brand-assets")
    .upload(path, buffer, {
      contentType: "image/webp",
      upsert: true,
    });

  if (error) throw new Error(`Failed to upload logo: ${error.message}`);
  
  const { data: { publicUrl } } = supabase.storage
    .from("brand-assets")
    .getPublicUrl(path);
    
  return publicUrl;
}
