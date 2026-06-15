"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // -----------------------------
  // INIT
  // -----------------------------
  useEffect(() => {
    init();

    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(
      window.location.search
    );

    const campaignId = searchParams.get("campaign");
    const tx_ref = searchParams.get("tx_ref");

    if (campaignId && tx_ref) {
      verifyPayment(campaignId, tx_ref);
    }
  }, []);

  async function init() {
    const { data } = await supabase.auth.getUser();
    const currentUser = data?.user;

    if (!currentUser) {
      router.push("/auth/login");
      return;
    }

    setUser(currentUser);
    await fetchMyListings(currentUser.id);
  }

  // -----------------------------
  // FETCH LISTINGS
  // -----------------------------
  async function fetchMyListings(userId: string) {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setListings(data || []);
    setLoading(false);
  }

  // -----------------------------
  // VERIFY PAYMENT (CHAPA)
  // -----------------------------
  async function verifyPayment(
    campaignId: string,
    tx_ref: string
  ) {
    try {
      const res = await fetch("/api/chapa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ campaignId, tx_ref }),
      });

      const data = await res.json();

      if (data.success) {
        alert("🚀 Campaign activated!");

        window.history.replaceState({}, "", "/dashboard");

        const { data: authData } =
          await supabase.auth.getUser();

        if (authData?.user) {
          fetchMyListings(authData.user.id);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  // -----------------------------
  // DELETE LISTING
  // -----------------------------
  async function deleteListing(id: string) {
    const confirmDelete = confirm(
      "Delete this listing?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to delete listing");
      return;
    }

    setListings((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  // -----------------------------
  // METRICS (OPTIMIZED)
  // -----------------------------
  const boostedListings = useMemo(
    () =>
      listings.filter((item) => item.boost_score > 0)
        .length,
    [listings]
  );

  const totalViews = useMemo(
    () =>
      listings.reduce(
        (sum, item) => sum + (item.views || 0),
        0
      ),
    [listings]
  );

  // -----------------------------
  // LOADING STATE
  // -----------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#050816]">
        Loading AdSphere Dashboard...
      </div>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="space-y-10 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            My Dashboard
          </h1>

          <p className="text-gray-400 text-sm">
            Manage your AdSphere listings
          </p>
        </div>

        <Link
          href="/list-space"
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
        >
          + Create Listing
        </Link>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-gray-400 text-sm">
            Listings
          </p>
          <h2 className="text-3xl font-bold mt-2">
            {listings.length}
          </h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-gray-400 text-sm">
            Total Views
          </p>
          <h2 className="text-3xl font-bold mt-2">
            {totalViews}
          </h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-gray-400 text-sm">
            Boosted Listings
          </p>
          <h2 className="text-3xl font-bold mt-2 text-yellow-400">
            {boostedListings}
          </h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-gray-400 text-sm">
            Account
          </p>
          <p className="text-sm mt-2 break-all">
            {user?.email}
          </p>
        </div>

      </div>

      {/* LISTINGS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Your Listings
        </h2>

        {listings.length === 0 && (
          <p className="text-gray-400">
            You have no listings yet.
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-6">

          {listings.map((item) => (
            <div
              key={item.id}
              className="border border-white/10 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition"
            >

              {/* IMAGE */}
              <div className="h-40 bg-black rounded-lg overflow-hidden mb-3">
                {item.image ? (
                  <img
                    src={item.image}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              {/* INFO */}
              <h3 className="font-semibold">
                {item.title}
              </h3>

              <p className="text-sm text-gray-400">
                {item.location}
              </p>

              <p className="text-blue-400 font-bold mt-2">
                {item.price}
              </p>

              <div className="text-xs text-gray-400 mt-2">
                👁 {item.views || 0} views
              </div>

              {item.boost_score > 0 && (
                <div className="mt-2 inline-block px-2 py-1 bg-yellow-500 text-black text-xs rounded animate-pulse">
                  🚀 Boosted
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex gap-2 mt-4">

                <Link href={`/dashboard/edit/${item.id}`}>
                  <button className="bg-blue-500 px-3 py-1 rounded text-xs hover:bg-blue-400">
                    Edit
                  </button>
                </Link>

                <button
                  onClick={() => deleteListing(item.id)}
                  className="bg-red-500 px-3 py-1 rounded text-xs hover:bg-red-400"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      </div>

    </div>
  );
}