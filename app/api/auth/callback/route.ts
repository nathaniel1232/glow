import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect = requestUrl.searchParams.get("redirect") || "/generate";
  const description = requestUrl.searchParams.get("description");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(new URL("/login?error=auth", requestUrl.origin));
    }
  }

  const dest = new URL(redirect, requestUrl.origin);
  if (description) dest.searchParams.set("description", description);
  return NextResponse.redirect(dest);
}
