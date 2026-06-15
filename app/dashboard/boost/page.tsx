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
    setLoading(true);

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

    window.location.href = data.url;
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleBoost("basic")}
        className="bg-yellow-500 text-black px-3 py-1 rounded text-xs font-bold"
      >
        Boost $5
      </button>

      <button
        onClick={() => handleBoost("premium")}
        className="bg-orange-500 text-black px-3 py-1 rounded text-xs font-bold"
      >
        Premium $10
      </button>
    </div>
  );
}