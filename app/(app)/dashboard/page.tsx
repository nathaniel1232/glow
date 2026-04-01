import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserProjects } from "@/lib/db";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const projects = await getUserProjects(user.id);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-semibold tracking-tight">
            Your brands
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {projects.length === 0
              ? "No brands yet. Create your first one."
              : `${projects.length} brand${projects.length === 1 ? "" : "s"} generated`}
          </p>
        </div>
        <Link
          href="/generate"
          className="h-10 px-5 text-sm font-medium bg-purple text-bg rounded-lg inline-flex items-center hover:bg-purple/90 transition-colors"
        >
          New brand
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-24 rounded-xl border border-border-subtle bg-bg-raised">
          <p className="text-text-muted">
            Describe your business and pick a vibe to get started.
          </p>
          <Link
            href="/generate"
            className="mt-4 inline-flex items-center text-sm text-purple hover:underline"
          >
            Create your first brand
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/brand/${project.id}`}
              className="group rounded-xl border border-border-subtle bg-bg-raised overflow-hidden hover:border-border transition-colors"
            >
              {/* Color preview */}
              <div className="h-24 flex">
                {Object.entries(project.colors)
                  .filter(([key]) => key !== "usage")
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex-1"
                      style={{ backgroundColor: value as string }}
                    />
                  ))}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-medium group-hover:text-purple transition-colors">
                    {project.name}
                  </h3>
                  {project.is_paid && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple/10 text-purple">
                      Paid
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-muted mt-1 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs px-2 py-0.5 rounded-full border border-border-subtle text-text-dim capitalize">
                    {project.vibe}
                  </span>
                  <span className="text-xs text-text-dim">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
