"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listingRank } from "@/lib/core/ranking/rankListing";
import { trustScore } from "@/lib/core/trust/trustScore";

type Listing = {
  id: string;
  title: string;
  location: string;
  created_at: string;
  owner_id: string;
  views?: number;
  likes?: number;
  rank?: number;
};

export default function MarketplacePage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [trustMap, setTrustMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    try {
      const data = await listingRank.getRankedListings();
      setListings(data);

      // 🧠 preload trust scores for all owners (OPTIMIZED UI LAYER)
      const trustResults = await Promise.all(
        data.map(async (item) => ({
          id: item.owner_id,
          score: await trustScore.get(item.owner_id),
        }))
      );

      const map: Record<string, number> = {};
      trustResults.forEach((t) => {
        map[t.id] = t.score;
      });

      setTrustMap(map);
    } catch (err) {
      console.error(err);
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

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        Marketplace
      </h1>

      {/* LOADING */}
      {loading && (
        <p className="text-white/50">Loading ranked listings...</p>
      )}

      {/* GRID */}
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

              {/* TITLE + TRUST BADGE */}
              <h2 className="font-semibold flex items-center gap-2">
                {item.title}

                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                  {getTrustLabel(trust)}
                </span>
              </h2>

              {/* LOCATION */}
              <p className="text-white/60 text-sm">
                {item.location}
              </p>

              {/* TRUST SCORE */}
              <p className="text-xs mt-1 text-white/50">
                Trust Score: {trust}/100
              </p>

              {/* RANK SCORE */}
              {item.rank && (
                <p className="text-xs text-green-400 mt-1">
                  Rank Score: {item.rank.toFixed(1)}
                </p>
              )}

              {/* VIEW BUTTON */}
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

