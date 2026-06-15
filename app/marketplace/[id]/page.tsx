"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

/* =========================
   BOOST CHECK
========================= */
function isBoostActive(item: any = {}) {
  if (!item?.boost_score || item.boost_score <= 0) return false;
  if (!item.boost_expires_at) return true;
  return new Date(item.boost_expires_at) > new Date();
}

export default function ListingDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [listing, setListing] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchListing();
  }, [id]);

  async function fetchListing() {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      setLoading(false);
      return;
    }

    setListing(data);
    setLoading(false);

    if (data) {
      fetchRelated(data);
      trackView();
    }
  }

  async function fetchRelated(current: any) {
    const { data } = await supabase
      .from("listings")
      .select("*")
      .eq("location", current.location)
      .neq("id", current.id)
      .limit(3);

    setRelated(data || []);
  }

  async function trackView() {
    try {
      await supabase.rpc("increment_views", { row_id: id });
    } catch {}
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#050816]">
        Loading...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#050816]">
        Listing not found
      </div>
    );
  }

  const boosted = isBoostActive(listing);

  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-12">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">

        {/* =========================
           LEFT MAIN
        ========================= */}
        <div className="lg:col-span-2 space-y-8">

          {/* HERO IMAGE */}
          <div className="relative h-[420px] rounded-2xl overflow-hidden border border-white/10 bg-black">

            {boosted && (
              <div className="absolute top-4 left-4 z-10 bg-yellow-400 text-black px-3 py-1 text-xs font-bold rounded-full">
                BOOSTED
              </div>
            )}

            {listing.image ? (
              <img
                src={listing.image}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-white/30">
                No Image
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>

          {/* TITLE BLOCK */}
          <div>
            <h1 className="text-3xl font-semibold">
              {listing.title}
            </h1>

            <p className="text-white/50 mt-2">
              📍 {listing.location}
            </p>

            <div className="flex justify-between mt-5 items-center">
              <p className="text-blue-400 text-2xl font-bold">
                {listing.price}
              </p>

              <p className="text-white/40 text-sm">
                👁 {listing.views || 0} views
              </p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {listing.description || "No description provided."}
            </p>
          </div>

          {/* METRICS */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Performance Data</h3>

            <div className="grid grid-cols-2 gap-3 text-sm text-white/60">

              <p>👥 Followers: {listing.followers || 0}</p>
              <p>👁 Avg Views: {listing.average_views || 0}</p>
              <p>🔥 Engagement: {listing.engagement_rate || 0}%</p>
              <p>🌍 Audience: {listing.audience_country || "N/A"}</p>

              {listing.daily_traffic && (
                <p>🚦 Traffic: {listing.daily_traffic}</p>
              )}

              {listing.dimensions && (
                <p>📐 Size: {listing.dimensions}</p>
              )}

              <p>🏷 Type: {listing.type}</p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl">
              Book Space
            </button>

            <button className="px-6 py-3 border border-white/15 rounded-xl">
              Save
            </button>
          </div>
        </div>

        {/* =========================
           RIGHT SIDEBAR (SYSTEM PANEL)
        ========================= */}
        <div className="space-y-6">

          {/* OWNER */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="font-semibold mb-2">Owner</h3>
            <p className="text-white/50 text-sm break-all">
              {listing.user_id || "Unknown"}
            </p>
          </div>

          {/* BOOST STATUS */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="font-semibold mb-2">Boost Status</h3>

            {boosted ? (
              <p className="text-yellow-400 text-sm">
                Active Boost
              </p>
            ) : (
              <p className="text-white/40 text-sm">
                No active boost
              </p>
            )}
          </div>

          {/* QUICK INFO */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-2 text-sm text-white/60">

            <p>📍 {listing.location}</p>
            <p>💰 {listing.price}</p>
            <p>👁 {listing.views || 0} views</p>
            <p>🏷 {listing.type}</p>

          </div>

        </div>
      </div>

      {/* =========================
         RELATED
      ========================= */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto mt-16">
          <h2 className="text-xl font-semibold mb-6">
            Related Listings
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {related.map((item) => (
              <Link key={item.id} href={`/marketplace/${item.id}`}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-white/40 text-sm">
                    {item.location}
                  </p>
                  <p className="text-blue-400 mt-2">
                    {item.price}
                  </p>
                </div>
              </Link>
            ))}

          </div>
        </div>
      )}

    </main>
  );
}