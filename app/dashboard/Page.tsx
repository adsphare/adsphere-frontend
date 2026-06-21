"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BoostModal from "@/components/BoostModal";

/* =========================
   TYPES
========================= */
type Listing = {
  id: string;
  title: string;
  location: string;
  price: string;
  image?: string;
  views?: number;
  boost_expires_at?: string | null;
  rank_score?: number;
  created_at?: string;
};

/* =========================
   DASHBOARD
========================= */
export default function DashboardPage() {
  const router = useRouter();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [boostOpen, setBoostOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  /* =========================
     INIT
  ========================= */
  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      router.push("/auth/login");
      return;
    }

    setUser(data.user);

    const { data: listingsData, error: listError } = await supabase
      .from("listings")
      .select("*")
      .eq("user_id", data.user.id)
      .order("created_at", { ascending: false });

    if (listError) {
      console.error(listError);
      setLoading(false);
      return;
    }

    setListings(listingsData || []);
    setLoading(false);
  }

  /* =========================
     DELETE
  ========================= */
  async function deleteListing(id: string) {
    if (!confirm("Delete this listing?")) return;

    await supabase.from("listings").delete().eq("id", id);

    setListings((prev) => prev.filter((x) => x.id !== id));
  }

  /* =========================
     BOOST
  ========================= */
  function openBoost(id: string) {
    setSelectedListing(id);
    setBoostOpen(true);
  }

  function closeBoost() {
    setBoostOpen(false);
    setSelectedListing(null);
  }

  /* =========================
     BOOST CHECK
  ========================= */
  function isBoosted(item: Listing) {
    if (!item.boost_expires_at) return false;
    return new Date(item.boost_expires_at) > new Date();
  }

  /* =========================
     METRICS
  ========================= */
  const totalViews = useMemo(
    () => listings.reduce((s, l) => s + (l.views || 0), 0),
    [listings]
  );

  const boostedCount = useMemo(
    () => listings.filter(isBoosted).length,
    [listings]
  );

  const avgRank = useMemo(() => {
    if (!listings.length) return 0;
    return (
      listings.reduce((s, l) => s + (l.rank_score || 0), 0) /
      listings.length
    ).toFixed(1);
  }, [listings]);

  /* =========================
     LOADING UI
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        Loading Dashboard...
      </div>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-10 space-y-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-white/40 text-sm">
            Manage listings, ranking & visibility
          </p>
        </div>

        <Link
          href="/list-space"
          className="px-4 py-2 bg-blue-600 rounded-lg"
        >
          + Create Listing
        </Link>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4">

        <Stat label="Listings" value={listings.length} />
        <Stat label="Views" value={totalViews} />
        <Stat label="Boosted" value={boostedCount} />
        <Stat label="Avg Rank" value={avgRank} />

      </div>

      {/* LISTINGS */}
      <div className="space-y-4">

        <h2 className="text-xl font-semibold">Your Listings</h2>

        {listings.length === 0 ? (
          <p className="text-white/40">No listings yet</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">

            {listings.map((item) => (
              <div
                key={item.id}
                className="border border-white/10 bg-white/5 rounded-xl overflow-hidden"
              >

                {/* IMAGE */}
                <div className="h-40 bg-black">
                  {item.image ? (
                    <img
                      src={item.image}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-white/30">
                      No Image
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-4 space-y-1">

                  <h3 className="font-semibold">{item.title}</h3>

                  <p className="text-white/40 text-sm">
                    📍 {item.location}
                  </p>

                  <p className="text-blue-400 font-bold">
                    {item.price}
                  </p>

                  <p className="text-xs text-white/40">
                    👁 {item.views || 0} views
                  </p>

                  <p className="text-xs text-white/40">
                    ⭐ Rank: {item.rank_score || 0}
                  </p>

                  {/* BOOST STATUS */}
                  {isBoosted(item) && (
                    <span className="inline-block mt-2 text-xs px-2 py-1 bg-yellow-500 text-black rounded">
                      🚀 Boost Active
                    </span>
                  )}

                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-3">

                    <button
                      onClick={() => openBoost(item.id)}
                      className="px-3 py-1 text-xs bg-yellow-500 text-black rounded"
                    >
                      Boost
                    </button>

                    <Link href={`/dashboard/edit/${item.id}`}>
                      <button className="px-3 py-1 text-xs bg-blue-600 rounded">
                        Edit
                      </button>
                    </Link>

                    <button
                      onClick={() => deleteListing(item.id)}
                      className="px-3 py-1 text-xs bg-red-600 rounded"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* BOOST MODAL */}
      {boostOpen && selectedListing && user && (
        <BoostModal
          open={boostOpen}
          onClose={closeBoost}
          listingId={selectedListing}
          userId={user.id}
        />
      )}

    </main>
  );
}

/* =========================
   SMALL COMPONENT
========================= */
function Stat({ label, value }: any) {
  return (
    <div className="p-5 rounded-xl border border-white/10 bg-white/5">
      <p className="text-white/40 text-sm">{label}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}