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

  useEffect(() => {
    init();

    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
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

  async function fetchMyListings(userId: string) {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setListings(data || []);
    setLoading(false);
  }

  async function verifyPayment(campaignId: string, tx_ref: string) {
    try {
      const res = await fetch("/api/chapa/verify", {
        method: "POST",
      body: JSON.stringify({ campaignId, tx_ref }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        alert("🚀 Campaign activated!");
        window.history.replaceState({}, "", "/dashboard");

        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) fetchMyListings(authData.user.id);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteListing(id: string) {
    if (!confirm("Delete this listing?")) return;

    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", id);

    if (!error) {
      setListings((prev) => prev.filter((i) => i.id !== id));
    }
  }

  const boostedListings = useMemo(
    () => listings.filter((i) => i.boost_score > 0).length,
    [listings]
  );

  const totalViews = useMemo(
    () => listings.reduce((sum, i) => sum + (i.views || 0), 0),
    [listings]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        Loading AdSphere Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-10 py-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-white/40 text-sm">
            Manage your AdSphere listings & performance
          </p>
        </div>

        <Link
          href="/list-space"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl transition font-medium"
        >
          + Create Listing
        </Link>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-5">

        {[
          { label: "Listings", value: listings.length },
          { label: "Total Views", value: totalViews },
          { label: "Boosted", value: boostedListings },
          { label: "Account", value: user?.email },
        ].map((s, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-white/5 bg-white/5"
          >
            <p className="text-white/40 text-sm">{s.label}</p>
            <h2 className="text-xl font-semibold mt-2 break-all">
              {s.value}
            </h2>
          </div>
        ))}

      </div>

      {/* LISTINGS */}
      <div className="space-y-4">

        <h2 className="text-xl font-semibold">
          Your Listings
        </h2>

        {listings.length === 0 && (
          <p className="text-white/40">
            You have no listings yet.
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-6">

          {listings.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition overflow-hidden"
            >

              {/* IMAGE */}
              <div className="h-40 bg-black overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white/20">
                    No Image
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-1">

                <h3 className="font-semibold">{item.title}</h3>

                <p className="text-white/40 text-sm">
                  {item.location}
                </p>

                <p className="text-blue-400 font-bold">
                  {item.price}
                </p>

                <p className="text-xs text-white/40">
                  👁 {item.views || 0} views
                </p>

                {item.boost_score > 0 && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-yellow-500 text-black rounded">
                    🚀 Boosted
                  </span>
                )}

                {/* ACTIONS */}
                <div className="flex gap-2 mt-4">

                  <Link href={`/dashboard/edit/${item.id}`}>
                    <button className="px-3 py-1 text-xs bg-blue-500 rounded hover:bg-blue-400">
                      Edit
                    </button>
                  </Link>

                  <button
                    onClick={() => deleteListing(item.id)}
                    className="px-3 py-1 text-xs bg-red-500 rounded hover:bg-red-400"
                  >
                    Delete
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}