"use client";

import { useEffect, useState } from "react";
import { trustScore } from "@/lib/core/trust/trustScore";

export default function TrustMeter({ userId }: { userId: string }) {
  const [score, setScore] = useState(50);

  useEffect(() => {
    trustScore.get(userId).then(setScore);
  }, [userId]);

  return (
    <div className="w-full">
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all"
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="text-xs text-white/60 mt-1">
        Trust Score: {score}/100
      </p>
    </div>
  );
}