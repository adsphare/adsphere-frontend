"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase/browser";

const supabase = createBrowserSupabase();

type Campaign = {
  id: string;
  title: string;
  budget: number | null;
  status: string | null;
};

type Listing = {
  id: string;
  title: string;
  boost_score: number | null;
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    listing_id: "",
    title: "",
    budget: "",
  });

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      window.location.href = "/auth/login";
      return;
    }

    const id = data.user.id;

    setUserId(id);

    await Promise.all([
      fetchListings(id),
      fetchCampaigns(id),
    ]);

    setLoading(false);
  }

  async function fetchListings(id: string) {
    const { data, error } = await supabase
      .from("listings")
      .select("id, title, boost_score")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load listings:", error);
      setListings([]);
      return;
    }

    setListings((data ?? []) as Listing[]);
  }

  async function fetchCampaigns(id: string) {
    const { data, error } = await supabase
      .from("campaigns")
      .select("id, title, budget, status")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load campaigns:", error);
      setCampaigns([]);
      return;
    }

    setCampaigns((data ?? []) as Campaign[]);
  }

  async function createCampaign() {
    if (creating) return;

    if (!form.listing_id || !form.title.trim() || !form.budget) {
      alert("Fill all fields");
      return;
    }

    const budget = Number(form.budget);

    if (!Number.isFinite(budget) || budget <= 0) {
      alert("Enter a valid budget");
      return;
    }

    if (!userId) {
      alert("You must be logged in");
      return;
    }

    try {
      setCreating(true);

      /*
       * Canonical campaign creation.
       *
       * IMPORTANT:
       * - No direct campaigns INSERT from the browser.
       * - No user_id is trusted from the client.
       * - No listing boost mutation occurs here.
       * - Campaign creation is handled by the authenticated API.
       */
      const response = await fetch("/api/campaigns/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: `Listing: ${form.listing_id}`,
        }),
      });

      let result: {
        success?: boolean;
        campaign?: Campaign;
        error?: string;
      };

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok || !result.success) {
        console.error("Campaign creation failed:", result.error);

        alert(
          result.error ||
            "Unable to create campaign"
        );

        return;
      }

      setForm({
        listing_id: "",
        title: "",
        budget: "",
      });

      await fetchCampaigns(userId);

      alert(
        "Campaign created as a draft. Payment and promotion require the canonical campaign/payment flow."
      );
    } catch (error: unknown) {
      console.error("Campaign creation error:", error);

      alert("Unable to create campaign");
    } finally {
      setCreating(false);
    }
  }

  /*
   * Direct browser-side boost mutation has intentionally been removed.
   *
   * Boosts must only become active through:
   *
   * Chapa initialize
   *   -> verified provider payment
   *   -> canonical settlement RPC
   *   -> server/database boost projection
   *
   * This prevents clients from manufacturing boost_score.
   */

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

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">
              Campaigns
            </h1>

            <p className="text-gray-400 text-sm">
              Manage campaigns and paid promotion
            </p>
          </div>

          <Link
            href="/list-space"
            className="px-4 py-2 bg-blue-600 rounded-lg"
          >
            + New Listing
          </Link>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
          <h2 className="text-lg font-semibold mb-4">
            Create Campaign
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <select
              value={form.listing_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  listing_id: e.target.value,
                })
              }
              className="p-2 bg-black border border-white/10 rounded"
              disabled={creating}
            >
              <option value="">
                Select Listing
              </option>

              {listings.map((listing) => (
                <option
                  key={listing.id}
                  value={listing.id}
                >
                  {listing.title}
                </option>
              ))}
            </select>

            <input
              placeholder="Campaign Title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              className="p-2 bg-black border border-white/10 rounded"
              disabled={creating}
              maxLength={200}
            />

            <input
              placeholder="Budget"
              type="number"
              min="0"
              step="0.01"
              value={form.budget}
              onChange={(e) =>
                setForm({
                  ...form,
                  budget: e.target.value,
                })
              }
              className="p-2 bg-black border border-white/10 rounded"
              disabled={creating}
            />
          </div>

          <button
            onClick={createCampaign}
            disabled={creating}
            className="mt-4 px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
          >
            {creating
              ? "Creating..."
              : "Create Campaign"}
          </button>

          <p className="mt-3 text-xs text-white/40">
            Campaign creation does not activate or boost a listing.
            Paid promotion is processed through the canonical payment flow.
          </p>
        </div>

        <div className="space-y-4">
          {campaigns.length === 0 && (
            <p className="text-gray-400">
              No campaigns yet
            </p>
          )}

          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="p-4 border border-white/10 rounded-lg bg-white/5"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">
                    {campaign.title}
                  </h3>

                  <p className="text-gray-400 text-sm">
                    Budget: {campaign.budget ?? 0}
                  </p>
                </div>

                <span className="text-blue-400 text-sm">
                  {campaign.status ?? "unknown"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">
                Listings
              </h2>

              <p className="text-xs text-white/40">
                Boost scores are server-controlled.
              </p>
            </div>

            <Link
              href="/dashboard/boost"
              className="px-3 py-2 bg-blue-600 rounded-lg text-sm"
            >
              Manage Boosts
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="p-4 border border-white/10 rounded-lg bg-white/5"
              >
                <h3>
                  {listing.title}
                </h3>

                <p className="text-xs text-white/40 mt-2">
                  Boost score:{" "}
                  {listing.boost_score ?? 0}
                </p>

                <Link
                  href="/dashboard/boost"
                  className="inline-block mt-3 px-3 py-1 bg-blue-600 rounded"
                >
                  Boost
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
