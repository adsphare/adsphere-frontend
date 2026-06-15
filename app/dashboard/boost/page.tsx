"use client";

import { useState } from "react";

export default function BoostButton({
  listingId,
  userId,
}: {
  listingId: string;
  userId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleBoost(plan: "basic" | "premium") {
    if (loading) return; // prevent double clicks

    setLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          userId,
          plan,
        }),
      });

      const data = await res.json();

      if (!data?.url) {
        throw new Error("No checkout URL returned");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Boost error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={loading}
        onClick={() => handleBoost("basic")}
        className="bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black px-3 py-1 rounded text-xs font-bold"
      >
        {loading ? "Processing..." : "Boost $5"}
      </button>

      <button
        disabled={loading}
        onClick={() => handleBoost("premium")}
        className="bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-black px-3 py-1 rounded text-xs font-bold"
      >
        {loading ? "Processing..." : "Premium $10"}
      </button>
    </div>
  );
}