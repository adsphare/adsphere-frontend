"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AnalyticsPage() {
  const [userId, setUserId] = useState<string | null>(null);

  const [listings, setListings] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setUserId(user.id);

    await fetchListings(user.id);
    await fetchCampaigns(user.id);

    setLoading(false);
  }

  async function fetchListings(userId: string) {
    const { data } = await supabase
      .from("listings")
      .select("*")
      .eq("user_id", userId);

    setListings(data || []);
  }

  async function fetchCampaigns(userId: string) {
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .eq("user_id", userId);

    setCampaigns(data || []);
  }

  // -------------------------
  // METRICS CALCULATION
  // -------------------------

  const totalListings = listings.length;

  const totalViews = listings.reduce(
    (sum, l) => sum + (l.views || 0),
    0
  );

  const boostedListings = listings.filter(
    (l) => l.is_boosted === true
  ).length;

  const totalCampaigns = campaigns.length;

  const activeCampaigns = campaigns.filter(
    (c) => c.status === "active"
  ).length;

  const totalBudget = campaigns.reduce(
    (sum, c) => sum + Number(c.budget || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        Loading analytics...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">
            Analytics Dashboard
          </h1>
          <p className="text-gray-400 text-sm">
            Track your AdSphere performance
          </p>
        </div>

        {/* STATS GRID */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* LISTINGS */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-gray-400 text-sm">
              Total Listings
            </p>
            <h2 className="text-3xl font-bold mt-2">
              {totalListings}
            </h2>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-gray-400 text-sm">
              Total Views
            </p>
            <h2 className="text-3xl font-bold mt-2 text-blue-400">
              {totalViews}
            </h2>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-gray-400 text-sm">
              Boosted Listings
            </p>
            <h2 className="text-3xl font-bold mt-2 text-green-400">
              {boostedListings}
            </h2>
          </div>

          {/* CAMPAIGNS */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-gray-400 text-sm">
              Total Campaigns
            </p>
            <h2 className="text-3xl font-bold mt-2">
              {totalCampaigns}
            </h2>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-gray-400 text-sm">
              Active Campaigns
            </p>
            <h2 className="text-3xl font-bold mt-2 text-green-400">
              {activeCampaigns}
            </h2>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-gray-400 text-sm">
              Total Budget
            </p>
            <h2 className="text-3xl font-bold mt-2 text-yellow-400">
              ${totalBudget}
            </h2>
          </div>

        </div>

        {/* INSIGHT SECTION */}
        <div className="mt-10 p-6 bg-white/5 border border-white/10 rounded-xl">
          <h2 className="text-lg font-semibold mb-2">
            AI Insight (MVP)
          </h2>

          {totalViews > 50 ? (
            <p className="text-green-400">
              🔥 Your listings are performing well. Consider boosting top listings.
            </p>
          ) : (
            <p className="text-gray-400">
              📉 Low traffic detected. Try boosting listings or adding campaigns.
            </p>
          )}
        </div>

      </div>
    </main>
  );
}