"use client";

import { useEffect, useState } from "react";
import { trustScore } from "@/lib/core/trust/trustScore";
import TrustBadge from "./TrustBadge";
import TrustMeter from "./TrustMeter";

export default function TrustPanel({ userId }: { userId: string }) {
  const [score, setScore] = useState<number>(50);

  useEffect(() => {
    async function load() {
      const s = await trustScore.get(userId);
      setScore(s);
    }

    load();
  }, [userId]);

  return (
    <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">

      {/* BADGE */}
      <TrustBadge userId={userId} />

      {/* SCORE TEXT */}
      <div className="text-xs text-white/60">
        Trust Score: {score}/100
      </div>

      {/* METER */}
      <TrustMeter userId={userId} />
    </div>
  );
}

