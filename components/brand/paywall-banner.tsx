"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  projectId: string;
}

export function PaywallBanner({ projectId }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(plan: "one_time" | "subscription") {
    setLoading(plan);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, projectId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(null);
    }
  }

  return (
    <div className="mb-8 p-6 rounded-xl border border-purple/20 bg-bg-raised glow-border">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-heading font-medium">
            Unlock your brand kit
          </h3>
          <p className="text-sm text-text-muted mt-1">
            Download logos, export color specs, and get full access to your brand assets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleCheckout("one_time")}
            loading={loading === "one_time"}
            disabled={loading !== null}
          >
            $19 one-time
          </Button>
          <Button
            onClick={() => handleCheckout("subscription")}
            loading={loading === "subscription"}
            disabled={loading !== null}
          >
            $12/mo Pro
          </Button>
        </div>
      </div>
    </div>
  );
}
