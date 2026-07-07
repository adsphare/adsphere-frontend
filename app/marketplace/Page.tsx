"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getRankedListings,
  Listing,
} from "@/lib/core/ranking/listingRank";

import { trustScore } from "@/lib/core/trust/trustScore";

type RankedListing = Listing & { rank: number };

export default function MarketplacePage() {
  const router = useRouter();

  const [listings, setListings] = useState<RankedListing[]>([]);
  const [trustMap, setTrustMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    try {
      const data = await getRankedListings();
      setListings(data);

      const trustResults = await Promise.all(
        data.map(async (item) => {
          const score = await trustScore.get(item.owner_id);
          return { id: item.owner_id, score };
        })
      );

      const map: Record<string, number> = {};

      for (const t of trustResults) {
        map[t.id] = t.score;
      }

      setTrustMap(map);
    } catch (err) {
      console.error("Marketplace load error:", err);
    }

    setLoading(false);
  }

  const getTrustLabel = (score: number) => {
    if (score >= 80) return "🟢 Verified";
    if (score >= 60) return "🔵 Trusted";
    if (score >= 40) return "🟡 New";
    return "🔴 Low Trust";
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">

      <h1 className="text-2xl font-bold mb-6">
        Marketplace
      </h1>

      {loading && (
        <p className="text-white/50">
          Loading ranked listings...
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {listings.map((item) => {
          const trust = trustMap[item.owner_id] ?? 50;
          const isHighTrust = trust >= 80;

          return (
            <div
              key={item.id}
              className={`p-4 border rounded-xl transition hover:bg-white/10
                ${
                  isHighTrust
                    ? "border-green-500/40 bg-green-500/10"
                    : "border-white/10 bg-white/5"
                }`}
            >
              <h2 className="font-semibold flex items-center gap-2">
                {item.title}

                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                  {getTrustLabel(trust)}
                </span>
              </h2>

              <p className="text-white/60 text-sm">
                {item.location}
              </p>

              <p className="text-xs mt-1 text-white/50">
                Trust Score: {trust}/100
              </p>

              <p className="text-xs text-green-400 mt-1">
                Rank Score: {item.rank.toFixed(1)}
              </p>

              <button
                onClick={() =>
                  router.push(`/marketplace/${item.id}`)
                }
                className="mt-3 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                View
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
