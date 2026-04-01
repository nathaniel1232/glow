import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function AppNav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle bg-bg/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-heading font-semibold tracking-tight">
          glow
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/generate"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            New brand
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            Dashboard
          </Link>
          <div className="h-8 w-8 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-xs text-text-muted">
            {user?.email?.charAt(0).toUpperCase() || "?"}
          </div>
        </div>
      </div>
    </nav>
  );
}
