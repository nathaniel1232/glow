"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Vibe } from "@/types";

const VIBES: { id: Vibe; label: string; desc: string }[] = [
  { id: "minimal", label: "Minimal", desc: "Clean, precise, whitespace" },
  { id: "bold", label: "Bold", desc: "Strong, confident, loud" },
  { id: "organic", label: "Organic", desc: "Natural, warm, textured" },
  { id: "y2k", label: "Y2K", desc: "Futuristic, neon, chrome" },
  { id: "dark", label: "Dark", desc: "Moody, sleek, tech" },
  { id: "coastal", label: "Coastal", desc: "Airy, oceanic, fresh" },
  { id: "retro", label: "Retro", desc: "Vintage, nostalgic, warm" },
  { id: "custom", label: "Custom", desc: "Write your own keywords" },
];

function GenerateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [description, setDescription] = useState(searchParams.get("description") || "");
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [customKeywords, setCustomKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"input" | "generating">("input");
  const [progress, setProgress] = useState(0);

  async function handleGenerate() {
    if (!description.trim() || !vibe) return;

    setLoading(true);
    setError("");
    setStep("generating");
    setProgress(0);

    const progressTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(progressTimer);
          return 90;
        }
        return p + Math.random() * 15;
      });
    }, 2000);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description.trim(), vibe, customKeywords: vibe === "custom" ? customKeywords.trim() : undefined }),
      });

      clearInterval(progressTimer);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();
      setProgress(100);

      setTimeout(() => {
        router.push(`/brand/${data.id}`);
      }, 500);
    } catch (err) {
      clearInterval(progressTimer);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("input");
      setLoading(false);
    }
  }

  if (step === "generating") {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="relative w-16 h-16 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-border" />
            <div
              className="absolute inset-0 rounded-full border-2 border-purple border-t-transparent animate-spin"
            />
          </div>
          <h2 className="text-2xl font-heading font-semibold tracking-tight">
            Building your brand
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            {progress < 30
              ? "Analyzing your business description..."
              : progress < 60
              ? "Generating brand strategy and colors..."
              : progress < 85
              ? "Creating logo concepts..."
              : "Finalizing your brand board..."}
          </p>
          <div className="mt-8 w-full bg-bg-elevated rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-purple rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-text-dim">
            This usually takes 30-60 seconds
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-heading font-semibold tracking-tight">
            Describe your business
          </h1>
          <p className="mt-2 text-text-muted">
            One sentence is all we need to generate your brand identity.
          </p>
        </div>

        <div className="space-y-8">
          {/* Description Input */}
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. A sustainable coffee subscription for remote workers..."
              className="w-full h-28 px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text placeholder:text-text-dim focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/20 transition-colors resize-none"
              maxLength={500}
            />
            <p className="mt-1 text-xs text-text-dim text-right">
              {description.length}/500
            </p>
          </div>

          {/* Vibe Selection */}
          <div>
            <label className="block text-sm text-text-muted mb-3">
              Choose a vibe
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {VIBES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVibe(v.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    vibe === v.id
                      ? "border-purple bg-purple/5"
                      : "border-border-subtle bg-bg-raised hover:border-border"
                  }`}
                >
                  <div className="text-sm font-medium">{v.label}</div>
                  <div className="text-xs text-text-dim mt-0.5">{v.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom keywords */}
          {vibe === "custom" && (
            <div>
              <label className="block text-sm text-text-muted mb-2">
                Your style keywords
              </label>
              <input
                value={customKeywords}
                onChange={(e) => setCustomKeywords(e.target.value)}
                placeholder="e.g. playful, bubbly, pastel colors, handwritten, friendly"
                className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text placeholder:text-text-dim focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/20 transition-colors"
                maxLength={200}
              />
              <p className="mt-1 text-xs text-text-dim">
                Describe the aesthetic in your own words — colors, mood, references, anything.
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-pink">{error}</p>
          )}

          <Button
            onClick={handleGenerate}
            disabled={!description.trim() || !vibe || (vibe === "custom" && !customKeywords.trim())}
            loading={loading}
            size="lg"
            className="w-full"
          >
            Generate brand identity
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense>
      <GenerateForm />
    </Suspense>
  );
}
