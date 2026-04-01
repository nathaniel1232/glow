"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/generate";
  const description = searchParams.get("description") || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const dest = new URL(redirect, window.location.origin);
    if (description) dest.searchParams.set("description", description);
    router.push(dest.pathname + dest.search);
    router.refresh();
  }

  return (
    <div>
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-heading font-semibold tracking-tight">
          glow
        </Link>
        <p className="mt-2 text-sm text-text-muted">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
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
          placeholder="Your password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && (
          <p className="text-sm text-pink">{error}</p>
        )}

        <Button type="submit" loading={loading} className="w-full">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        No account?{" "}
        <Link href="/signup" className="text-purple hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
