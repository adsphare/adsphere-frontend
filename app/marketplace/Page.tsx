"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Card from "@/components/card";
import { motion, AnimatePresence } from "framer-motion";

/* =========================
   FILTER BAR
========================= */
function FilterBar({ onChange }: any) {
  return (
    <div className="grid md:grid-cols-3 gap-3 mb-10">

      <input
        placeholder="Search listings..."
        className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
        onChange={(e) =>
          onChange((p: any) => ({ ...p, search: e.target.value }))
        }
      />

      <select
        className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
        onChange={(e) =>
          onChange((p: any) => ({ ...p, type: e.target.value }))
        }
      >
        <option value="all">All Types</option>
        <option value="billboard">Billboards</option>
        <option value="digital_screen">Digital Screens</option>
        <option value="instagram_creator">Creators</option>
        <option value="tiktok_creator">TikTok</option>
      </select>

      <input
        placeholder="Location..."
        className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
        onChange={(e) =>
          onChange((p: any) => ({ ...p, location: e.target.value }))
        }
      />
    </div>
  );
}

/* =========================
   RANK ENGINE
========================= */
function rank(item: any) {
  return (
    (item.views || 0) +
    (item.followers || 0) * 0.3 +
    (item.average_views || 0) * 0.3 +
    (item.engagement_rate || 0) * 2 +
    (item.boost_score || 0) * 50
  );
}

/* =========================
   LAYOUT ENGINE (TESLA STYLE)
========================= */
function layout(items: any[]) {
  const sorted = [...items].sort((a, b) => rank(b) - rank(a));

  return sorted.map((item, i) => {
    let size: "hero" | "large" | "medium" | "small";

    if (i === 0) size = "hero";
    else if (i < 3) size = "large";
    else if (i < 7) size = "medium";
    else size = "small";

    return { ...item, size };
  });
}

/* =========================
   PAGE
========================= */
export default function MarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    location: "",
  });

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    const { data } = await supabase.from("listings").select("*");
    setListings(data || []);
  }

  function filtered() {
    return listings.filter((item) => {
      if (filters.type !== "all" && item.type !== filters.type) return false;

      if (
        filters.search &&
        !item.title?.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;

      if (
        filters.location &&
        !item.location?.toLowerCase().includes(filters.location.toLowerCase())
      )
        return false;

      return true;
    });
  }

  const finalData = layout(filtered());

  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-10">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">
          Marketplace
        </h1>
        <p className="text-white/40 mt-2">
          AI-ranked visibility network
        </p>
      </div>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto">
        <FilterBar onChange={setFilters} />
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">

        <AnimatePresence mode="popLayout">
          {finalData.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`
                relative

                ${item.size === "hero" ? "col-span-12 h-[520px]" : ""}
                ${item.size === "large" ? "col-span-6 h-[360px]" : ""}
                ${item.size === "medium" ? "col-span-4 h-[260px]" : ""}
                ${item.size === "small" ? "col-span-4 h-[200px]" : ""}
              `}
            >
              <Card item={item} variant={item.size} />
            </motion.div>
          ))}
        </AnimatePresence>

      </div>

      {/* EMPTY */}
      {finalData.length === 0 && (
        <div className="text-center text-white/40 mt-20">
          No listings found
        </div>
      )}
    </main>
  );
}