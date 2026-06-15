"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

function SkeletonCard() {
  return (
    <div className="border border-white/10 bg-white/5 rounded-xl overflow-hidden animate-pulse">
      <div className="h-44 bg-white/10" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-2/3 bg-white/10 rounded" />
        <div className="h-3 w-full bg-white/10 rounded" />
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-white/10 rounded" />
          <div className="h-3 w-16 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("ranking_score", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Marketplace error:", error);
      setLoading(false);
      return;
    }

    setListings(data || []);
    setLoading(false);
  }

  const now = new Date();

  const listingsFixed = (listings || []).map((item) => ({
    ...item,
    boost_score:
      item.boost_expires_at &&
      new Date(item.boost_expires_at) < now
        ? 0
        : item.boost_score,
  }));

  const featuredCount = listingsFixed.filter(
    (item) => item.boost_score > 0
  ).length;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#050816] text-white pt-24 px-6"
    >
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Adsphre Marketplace
          </h1>

          <p className="text-white/50 mt-2">
            Discover creators, billboards, digital screens,
            newsletters, podcasts and advertising opportunities.
          </p>
        </div>

        {/* STATS */}
        <div className="flex flex-wrap gap-4 mb-10">

          <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4">
            <p className="text-xs text-white/50">
              Total Listings
            </p>

            <p className="text-xl font-semibold">
              {listingsFixed.length}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4">
            <p className="text-xs text-white/50">
              Featured Listings
            </p>

            <p className="text-xl font-semibold text-yellow-400">
              {featuredCount}
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* SIDEBAR */}
          <div className="space-y-4">

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">

              <h3 className="font-semibold mb-4">
                Categories
              </h3>

              <div className="space-y-3 text-white/60 text-sm">

                <button className="block hover:text-white">
                  📱 Creators
                </button>

                <button className="block hover:text-white">
                  🪧 Billboards
                </button>

                <button className="block hover:text-white">
                  📺 Digital Screens
                </button>

                <button className="block hover:text-white">
                  🎙 Podcasts
                </button>

                <button className="block hover:text-white">
                  📧 Newsletters
                </button>

              </div>

            </div>

          </div>

          {/* LISTINGS */}
          <div className="md:col-span-2 space-y-6">

            {loading &&
              [1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}

            {!loading &&
              listingsFixed.length === 0 && (
                <div className="border border-white/10 rounded-xl py-20 text-center text-white/40">
                  No listings yet — be the first to post 🚀
                </div>
              )}

            {listingsFixed.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
              >
                <Link href={`/marketplace/${item.id}`}>

                  <div className="relative border border-white/10 bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition">

                    {item.boost_score > 0 && (
                      <>
                        <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none" />

                        <div className="absolute top-3 left-3 bg-yellow-400 text-black text-xs px-2 py-1 rounded font-bold z-10">
                          🚀 FEATURED
                        </div>
                      </>
                    )}

                    {/* IMAGE */}
                    <div className="relative h-56 bg-black">

                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title || "Listing"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-white/30">
                          No Image
                        </div>
                      )}

                    </div>

                    {/* CONTENT */}
                    <div className="p-5">

                      <h2 className="font-semibold text-lg">
                        {item.title}
                      </h2>

                      <p className="text-white/50 text-sm mt-2">
                        {item.description}
                      </p>

                      <div className="flex justify-between mt-4 text-sm">

                        <span className="text-white/60">
                          📍 {item.location}
                        </span>

                        <span className="text-blue-400 font-semibold">
                          {item.price}
                        </span>

                      </div>

                      <div className="flex justify-between mt-4 text-xs text-white/40">

                        <span>
                          {item.type || "Advertising Space"}
                        </span>

                        <span>
                          👁 {item.views || 0}
                        </span>

                      </div>

                      {/* DEBUG RANK */}
                      <div className="mt-2 text-xs text-green-400">
                        Rank: {item.ranking_score || 0}
                      </div>

                      <div className="flex gap-3 mt-5">

                        <button className="px-4 py-2 bg-white text-black rounded-full text-sm hover:scale-105 transition">
                          View Details
                        </button>

                        <button className="px-4 py-2 border border-white/20 rounded-full text-sm hover:border-blue-500 transition">
                          Book Now
                        </button>

                      </div>

                    </div>

                  </div>

                </Link>
              </motion.div>
            ))}

          </div>

          {/* AI PANEL */}
          <div className="space-y-4">

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">

              <h3 className="font-semibold mb-4">
                AI Insights
              </h3>

              <div className="space-y-3 text-sm text-white/60">

                <p>🔥 High ROI creator opportunities</p>

                <p>📈 Trending campaigns</p>

                <p>🎯 Suggested categories</p>

                <p>🚀 Fastest growing listings</p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </motion.main>
  );
}