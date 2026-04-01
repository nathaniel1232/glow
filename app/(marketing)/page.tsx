"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const features = [
  {
    title: "Logo Concepts",
    desc: "3-5 unique logo variations generated from your brand description.",
  },
  {
    title: "Color Palette",
    desc: "Harmonized hex codes with clear usage guidelines for every context.",
  },
  {
    title: "Font Pairing",
    desc: "Curated Google Fonts that match your brand personality.",
  },
  {
    title: "Brand Voice",
    desc: "Tagline, tone, and messaging framework ready for launch.",
  },
  {
    title: "Social Templates",
    desc: "Pre-written content for Instagram, Twitter, and LinkedIn.",
  },
  {
    title: "Link-in-Bio Page",
    desc: "A branded landing page hosted and ready to share.",
  },
];

export default function Home() {
  const router = useRouter();
  const [description, setDescription] = useState("");

  function handleGenerate() {
    const trimmed = description.trim();
    if (!trimmed) return;
    router.push(`/signup?description=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-purple-dim)_0%,_transparent_50%)]" />
        <div className="relative max-w-3xl mx-auto px-6 pt-32 pb-24 text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold tracking-tight leading-[1.1]">
            Your brand, in{" "}
            <span className="gradient-text">60 seconds.</span>
          </h1>
          <p className="mt-5 text-lg text-text-muted max-w-xl mx-auto leading-relaxed">
            Describe your business in one sentence. Pick a vibe. Get a complete
            brand identity -- logo, colors, fonts, voice, and more.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Describe your business in one sentence..."
              className="flex-1 w-full h-12 px-5 bg-bg-elevated border border-border rounded-lg text-text placeholder:text-text-dim focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/20 transition-colors"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              className="h-12 px-6 bg-purple text-bg font-medium rounded-lg inline-flex items-center whitespace-nowrap hover:bg-purple/90 transition-colors disabled:opacity-50"
              disabled={!description.trim()}
            >
              Generate brand
            </button>
          </div>
          <p className="mt-3 text-xs text-text-dim">
            Free to preview. Pay only to download.
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-heading font-semibold tracking-tight">
            Everything you need to launch
          </h2>
          <p className="mt-3 text-text-muted">
            One input. One click. Complete brand identity.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-xl border border-border-subtle bg-bg-raised hover:border-border transition-colors"
            >
              <h3 className="text-base font-heading font-medium">{f.title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Before / After */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-heading font-semibold tracking-tight">
            From idea to identity
          </h2>
          <p className="mt-3 text-text-muted">
            What used to take weeks now takes seconds.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border-subtle bg-bg-raised p-8">
            <div className="text-xs font-mono text-text-dim uppercase tracking-wider mb-4">
              Before
            </div>
            <div className="space-y-3 text-sm text-text-muted">
              <p>Hours browsing Pinterest for inspiration</p>
              <p>Expensive designer or Fiverr lottery</p>
              <p>Weeks of back-and-forth revisions</p>
              <p>Cobbled-together color scheme</p>
              <p>No brand guidelines or voice</p>
            </div>
          </div>
          <div className="rounded-xl border border-purple/20 bg-bg-raised p-8 glow-border">
            <div className="text-xs font-mono text-purple uppercase tracking-wider mb-4">
              After Glow
            </div>
            <div className="space-y-3 text-sm text-text">
              <p>Complete brand identity in 60 seconds</p>
              <p>Multiple logo concepts to choose from</p>
              <p>Professional color palette with usage guide</p>
              <p>Curated font pairing from Google Fonts</p>
              <p>Brand voice, tagline, and social templates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-heading font-semibold tracking-tight">
            Simple pricing
          </h2>
          <p className="mt-3 text-text-muted">
            Preview for free. Pay when you are ready to download.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="rounded-xl border border-border-subtle bg-bg-raised p-8">
            <div className="text-sm font-mono text-text-dim uppercase tracking-wider">
              One-time
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-heading font-bold">$19</span>
            </div>
            <p className="mt-2 text-sm text-text-muted">
              Single brand kit export
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-text-muted">
              <li className="flex items-center gap-2">
                <span className="text-purple">--</span> Full brand board
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple">--</span> Logo downloads
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple">--</span> Color + font specs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple">--</span> Brand voice guide
              </li>
            </ul>
            <Link
              href="/signup"
              className="mt-8 w-full h-10 border border-border text-sm font-medium rounded-lg inline-flex items-center justify-center hover:border-purple/40 transition-colors"
            >
              Get started
            </Link>
          </div>
          <div className="rounded-xl border border-purple/30 bg-bg-raised p-8 glow-border relative">
            <div className="absolute -top-3 left-8 px-3 py-0.5 bg-purple text-bg text-xs font-medium rounded-full">
              Popular
            </div>
            <div className="text-sm font-mono text-text-dim uppercase tracking-wider">
              Pro Monthly
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-heading font-bold">$12</span>
              <span className="text-text-muted text-sm">/mo</span>
            </div>
            <p className="mt-2 text-sm text-text-muted">
              Unlimited brand generations
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-text-muted">
              <li className="flex items-center gap-2">
                <span className="text-purple">--</span> Everything in One-time
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple">--</span> Unlimited generations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple">--</span> Link-in-bio pages
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple">--</span> Social media templates
              </li>
            </ul>
            <Link
              href="/signup"
              className="mt-8 w-full h-10 bg-purple text-bg text-sm font-medium rounded-lg inline-flex items-center justify-center hover:bg-purple/90 transition-colors"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-heading font-semibold tracking-tight">
          Ready to build your brand?
        </h2>
        <p className="mt-3 text-text-muted">
          One sentence is all it takes. No design skills required.
        </p>
        <Link
          href="/signup"
          className="mt-8 h-12 px-8 bg-purple text-bg font-medium rounded-lg inline-flex items-center hover:bg-purple/90 transition-colors"
        >
          Get started for free
        </Link>
      </section>
    </div>
  );
}
