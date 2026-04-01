import { notFound } from "next/navigation";
import { getBrandProject } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { BrandBoard } from "@/components/brand/brand-board";
import { PaywallBanner } from "@/components/brand/paywall-banner";
import { BioEditor } from "@/components/brand/bio-editor";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ paid?: string }>;
}

export default async function BrandPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { paid } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) notFound();

  const project = await getBrandProject(id);
  if (!project || project.user_id !== user.id) notFound();

  const isPaid = true; // Temporarily free during beta

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <BrandBoard project={project} isPaid={isPaid} />
      {isPaid && (
        <div className="mt-12">
          <BioEditor
            projectId={project.id}
            currentSlug={project.bio_slug}
            currentLinks={project.bio_links || []}
          />
        </div>
      )}
    </div>
  );
}
