"use client";

import { useEffect, useState } from "react";
import { trustScore } from "@/lib/core/trust/trustScore";

export default function TrustBadge({ userId }: { userId: string }) {
  const [score, setScore] = useState(50);

  useEffect(() => {
    async function load() {
      const s = await trustScore.get(userId);
      setScore(s);
    }

    load();
  }, [userId]);

  const getLabel = () => {
    if (score >= 80) return "🟢 Verified Seller";
    if (score >= 60) return "🔵 Trusted Seller";
    if (score >= 40) return "🟡 New Seller";
    return "🔴 Low Trust";
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span>{getLabel()}</span>
    </div>
  );
}