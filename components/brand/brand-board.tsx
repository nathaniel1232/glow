"use client";

import Image from "next/image";
import type { BrandProject } from "@/types";

interface Props {
  project: BrandProject;
  isPaid: boolean;
}

export function BrandBoard({ project, isPaid }: Props) {
  const { colors, fonts, voice, logos, social_templates, brand_names } = project;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-heading font-bold tracking-tight">
          {brand_names[0]}
        </h1>
        <p className="mt-2 text-text-muted max-w-lg mx-auto">
          {voice.description}
        </p>
        <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
          {brand_names.map((name) => (
            <span
              key={name}
              className="px-3 py-1 text-xs border border-border-subtle rounded-full text-text-muted"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Tagline */}
      <div className="text-center py-12 rounded-2xl border border-border-subtle bg-bg-raised">
        <p className="text-xs font-mono uppercase tracking-wider text-text-dim mb-4">
          Tagline
        </p>
        <p className="text-2xl md:text-3xl font-heading font-medium tracking-tight px-6">
          &ldquo;{voice.tagline}&rdquo;
        </p>
      </div>

      {/* Logos */}
      <section>
        <SectionLabel>Logo Concepts</SectionLabel>
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${!isPaid ? "relative" : ""}`}>
          {logos.map((logo, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl border border-border-subtle bg-white overflow-hidden relative group"
            >
              <Image
                src={logo.url}
                alt={`Logo concept ${i + 1}`}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-white capitalize">{logo.style}</span>
              </div>
              {!isPaid && (
                <div className="absolute inset-0 backdrop-blur-md bg-bg/30 flex items-center justify-center">
                  <span className="text-xs text-text-muted">Unlock to download</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Color Palette */}
      <section>
        <SectionLabel>Color Palette</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(colors)
            .filter(([key]) => key !== "usage")
            .map(([key, value]) => (
              <div key={key} className="group">
                <div
                  className="aspect-[3/2] rounded-xl border border-border-subtle mb-2 transition-transform group-hover:scale-[1.02]"
                  style={{ backgroundColor: value as string }}
                />
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs text-text-muted capitalize">{key}</span>
                  <span className="text-xs font-mono text-text-dim">{value as string}</span>
                </div>
                {colors.usage && colors.usage[key] && (
                  <p className="text-xs text-text-dim mt-1 px-1">{colors.usage[key]}</p>
                )}
              </div>
            ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <SectionLabel>Typography</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-xl border border-border-subtle bg-bg-raised">
            <p className="text-xs font-mono uppercase tracking-wider text-text-dim mb-4">
              Heading
            </p>
            <link href={fonts.headingUrl} rel="stylesheet" />
            <p
              className="text-3xl font-bold"
              style={{ fontFamily: `'${fonts.heading}', sans-serif` }}
            >
              {fonts.heading}
            </p>
            <p
              className="mt-4 text-lg text-text-muted"
              style={{ fontFamily: `'${fonts.heading}', sans-serif` }}
            >
              The quick brown fox jumps over the lazy dog
            </p>
            <p className="mt-4 text-xs text-text-dim font-mono">
              fonts.google.com/specimen/{fonts.heading.replace(/\s/g, "+")}
            </p>
          </div>
          <div className="p-8 rounded-xl border border-border-subtle bg-bg-raised">
            <p className="text-xs font-mono uppercase tracking-wider text-text-dim mb-4">
              Body
            </p>
            <link href={fonts.bodyUrl} rel="stylesheet" />
            <p
              className="text-3xl font-bold"
              style={{ fontFamily: `'${fonts.body}', sans-serif` }}
            >
              {fonts.body}
            </p>
            <p
              className="mt-4 text-lg text-text-muted"
              style={{ fontFamily: `'${fonts.body}', sans-serif` }}
            >
              The quick brown fox jumps over the lazy dog
            </p>
            <p className="mt-4 text-xs text-text-dim font-mono">
              fonts.google.com/specimen/{fonts.body.replace(/\s/g, "+")}
            </p>
          </div>
        </div>
      </section>

      {/* Brand Voice */}
      <section>
        <SectionLabel>Brand Voice</SectionLabel>
        <div className="rounded-xl border border-border-subtle bg-bg-raised p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">
                Tone
              </p>
              <p className="text-lg font-heading font-medium">{voice.tone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">
                Description
              </p>
              <p className="text-text-muted leading-relaxed">{voice.description}</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border-subtle">
            <p className="text-xs font-mono uppercase tracking-wider text-text-dim mb-3">
              Keywords
            </p>
            <div className="flex flex-wrap gap-2">
              {voice.keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1 text-sm border border-border-subtle rounded-full text-text-muted"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Templates */}
      <section>
        <SectionLabel>Social Media Templates</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {social_templates.map((tmpl, i) => {
            const platform = tmpl.type;
            const platformIcons: Record<string, string> = {
              instagram: "IG",
              twitter: "X",
              linkedin: "in",
            };
            return (
              <div
                key={i}
                className="rounded-xl border border-border-subtle overflow-hidden bg-bg-raised"
              >
                {/* Platform bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border-subtle">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-border-subtle text-text-muted">
                    {platformIcons[platform] ?? platform}
                  </span>
                  <span className="text-xs text-text-dim capitalize">{platform}</span>
                </div>
                {/* Post preview */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: colors.primary, color: colors.background }}
                    >
                      {brand_names[0]?.[0]}
                    </div>
                    <span className="text-xs font-medium text-text-muted">{brand_names[0]}</span>
                  </div>
                  <p className="text-sm font-semibold leading-snug mb-1">
                    {tmpl.headline}
                  </p>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {tmpl.subtext}
                  </p>
                </div>
                {/* Copy button */}
                <div className="px-5 pb-4">
                  <button
                    onClick={() => navigator.clipboard?.writeText(`${tmpl.headline}\n\n${tmpl.subtext}`)}
                    className="text-xs text-text-dim hover:text-text transition-colors"
                  >
                    Copy text →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h2 className="text-lg font-heading font-medium whitespace-nowrap">{children}</h2>
      <div className="flex-1 h-px bg-border-subtle" />
    </div>
  );
}
