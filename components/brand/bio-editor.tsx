"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BioLink } from "@/types";

interface Props {
  projectId: string;
  currentSlug: string | null;
  currentLinks: BioLink[];
}

export function BioEditor({ projectId, currentSlug, currentLinks }: Props) {
  const [slug, setSlug] = useState(currentSlug || "");
  const [links, setLinks] = useState<BioLink[]>(
    currentLinks.length > 0 ? currentLinks : [{ label: "", url: "" }]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function addLink() {
    if (links.length >= 10) return;
    setLinks([...links, { label: "", url: "" }]);
  }

  function removeLink(index: number) {
    setLinks(links.filter((_, i) => i !== index));
  }

  function updateLink(index: number, field: "label" | "url", value: string) {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    setLinks(updated);
  }

  async function handleSave() {
    if (!slug.trim()) {
      setError("Please enter a slug for your bio page");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const validLinks = links.filter((l) => l.label.trim() && l.url.trim());

      const res = await fetch("/api/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
          links: validLinks,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save");
      }

      setSuccess(`Live at /bio/${data.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-raised p-6">
      <h3 className="text-lg font-heading font-medium mb-4">Link-in-Bio Page</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-text-muted mb-1.5">
            Page URL
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-dim">/bio/</span>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              placeholder="your-brand"
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-muted mb-1.5">
            Links
          </label>
          <div className="space-y-2">
            {links.map((link, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={link.label}
                  onChange={(e) => updateLink(i, "label", e.target.value)}
                  placeholder="Label"
                  className="flex-1"
                />
                <Input
                  value={link.url}
                  onChange={(e) => updateLink(i, "url", e.target.value)}
                  placeholder="https://..."
                  className="flex-1"
                />
                {links.length > 1 && (
                  <button
                    onClick={() => removeLink(i)}
                    className="h-11 w-11 flex items-center justify-center text-text-dim hover:text-pink transition-colors"
                  >
                    x
                  </button>
                )}
              </div>
            ))}
          </div>
          {links.length < 10 && (
            <button
              onClick={addLink}
              className="mt-2 text-sm text-purple hover:underline"
            >
              + Add link
            </button>
          )}
        </div>

        {error && <p className="text-sm text-pink">{error}</p>}
        {success && <p className="text-sm text-purple">{success}</p>}

        <Button onClick={handleSave} loading={loading}>
          Save bio page
        </Button>
      </div>
    </div>
  );
}
