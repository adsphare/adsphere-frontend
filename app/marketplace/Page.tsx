"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Card from "@/components/card";
import { updateRank } from "@/lib/ranking/updateRank";

/* =========================
   TYPES
========================= */
type Listing = {
  id: string;
  title: string;
  location: string;
  type?: string;
  price?: string;
  image?: string;
  rank_score?: number;
};

/* =========================
   PAGE
========================= */
export default function MarketplacePage() {
  const router = useRouter();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    location: "",
  });

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("rank_score", { ascending: false });

    if (error) {
      console.error("Marketplace error:", error);
      setLoading(false);
      return;
    }

    setListings(data || []);
    setLoading(false);

    // 🔥 SAFE BACKGROUND RANK UPDATE (NON-BLOCKING)
    refreshRanks(data || []);
  }

  /* =========================
     SAFE BACKGROUND RANK UPDATE
  ========================= */
  async function refreshRanks(items: Listing[]) {
    try {
      await Promise.all(
        items.map((item) => updateRank(item.id))
      );
    } catch (err) {
      console.error("Rank update error:", err);
    }
  }

  /* =========================
     FILTER + SORT
  ========================= */
  const filtered = useMemo(() => {
    return listings
      .filter((item) => {
        if (
          filters.type !== "all" &&
          item.type !== filters.type
        )
          return false;

        if (
          filters.search &&
          !item.title
            ?.toLowerCase()
            .includes(filters.search.toLowerCase())
        )
          return false;

        if (
          filters.location &&
          !item.location
            ?.toLowerCase()
            .includes(filters.location.toLowerCase())
        )
          return false;

        return true;
      })
      .sort(
        (a, b) =>
          (b.rank_score || 0) - (a.rank_score || 0)
      );
  }, [listings, filters]);

  /* =========================
     UI
  ========================= */
  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">
          Marketplace 🔥
        </h1>

        <p className="text-white/40 text-sm">
          Ranked by views, boost & freshness
        </p>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-white/40 mt-6">
          Loading marketplace...
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-white/40 mt-6">
          No listings found.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-5 mt-8">

          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                router.push(`/listings/${item.id}`)
              }
              className="cursor-pointer"
            >
              <Card item={item} />
            </div>
          ))}

        </div>
      )}

    </main>
  );
}