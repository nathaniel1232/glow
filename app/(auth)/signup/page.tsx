"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const description = searchParams.get("description") || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const redirectTo = description
      ? `${window.location.origin}/api/auth/callback?redirect=/generate&description=${encodeURIComponent(description)}`
      : `${window.location.origin}/api/auth/callback?redirect=/generate`;

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(description ? `/generate?description=${encodeURIComponent(description)}` : "/generate");
    router.refresh();
  }

  return (
    <div>
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-heading font-semibold tracking-tight">
          glow
        </Link>
        <p className="mt-2 text-sm text-text-muted">
          Create your account
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          id="password"
          type="password"
          placeholder="Min. 8 characters"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />

        {error && (
          <p className="text-sm text-pink">{error}</p>
        )}

        <Button type="submit" loading={loading} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-purple hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
