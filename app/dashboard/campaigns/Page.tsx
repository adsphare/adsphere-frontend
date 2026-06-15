"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    listing_id: "",
    title: "",
    budget: ""
  });

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
  }

  async function fetchListings(userId: string) {
    const { data } = await supabase
      .from("listings")
      .select("id, title")
      .eq("user_id", userId);

    setListings(data || []);
  }

  async function fetchCampaigns(userId: string) {
    setLoading(true);

    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setCampaigns(data || []);
    setLoading(false);
  }

  async function createCampaign() {
    if (!form.listing_id || !form.title || !form.budget) {
      alert("Fill all fields");
      return;
    }

    const { error } = await supabase.from("campaigns").insert({
      user_id: userId,
      listing_id: form.listing_id,
      title: form.title,
      budget: Number(form.budget),
      status: "active"
    });

    if (error) {
      console.log(error);
      return;
    }

    setForm({ listing_id: "", title: "", budget: "" });
    await fetchCampaigns(userId!);
  }

  async function boostListing(listingId: string) {
    const { error } = await supabase
      .from("listings")
      .update({
        is_boosted: true,
        boost_level: 1,
        boost_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      })
      .eq("id", listingId);

    if (error) {
      console.log(error);
      return;
    }

    alert("Listing boosted 🚀");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#050816]">
        Loading campaigns...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">
              Campaigns
            </h1>
            <p className="text-gray-400 text-sm">
              Manage and boost your ads
            </p>
          </div>

          <Link
            href="/list-space"
            className="px-4 py-2 bg-blue-600 rounded-lg"
          >
            + New Listing
          </Link>
        </div>

        {/* CREATE CAMPAIGN */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
          <h2 className="text-lg font-semibold mb-4">
            Create Campaign
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <select
              value={form.listing_id}
              onChange={(e) =>
                setForm({ ...form, listing_id: e.target.value })
              }
              className="p-2 bg-black border border-white/10 rounded"
            >
              <option value="">Select Listing</option>
              {listings.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>

            <input
              placeholder="Campaign Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              className="p-2 bg-black border border-white/10 rounded"
            />

            <input
              placeholder="Budget"
              type="number"
              value={form.budget}
              onChange={(e) =>
                setForm({ ...form, budget: e.target.value })
              }
              className="p-2 bg-black border border-white/10 rounded"
            />

          </div>

          <button
            onClick={createCampaign}
            className="mt-4 px-4 py-2 bg-green-500 rounded"
          >
            Create Campaign
          </button>
        </div>

        {/* CAMPAIGNS LIST */}
        <div className="space-y-4">
          {campaigns.length === 0 && (
            <p className="text-gray-400">
              No campaigns yet
            </p>
          )}

          {campaigns.map((c) => (
            <div
              key={c.id}
              className="p-4 border border-white/10 rounded-lg bg-white/5"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">
                    {c.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Budget: ${c.budget}
                  </p>
                </div>

                <span className="text-green-400 text-sm">
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* BOOST SECTION */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">
            Quick Boost Listings
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            {listings.map((l) => (
              <div
                key={l.id}
                className="p-4 border border-white/10 rounded-lg bg-white/5"
              >
                <h3>{l.title}</h3>

                <button
                  onClick={() => boostListing(l.id)}
                  className="mt-3 px-3 py-1 bg-blue-600 rounded"
                >
                  Boost 🚀
                </button>
              </div>
            ))}

          </div>
        </div>

      </div>
    </main>
  );
}