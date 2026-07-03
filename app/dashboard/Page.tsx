"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import BoostModal from "@/components/BoostModal";
import { getOrCreateConversation } from "@/lib/chat/getOrCreateConversation";

const supabase = createBrowserSupabase(); // ✅ FIX

type Listing = {
  id: string;
  title: string;
  location: string;
  price: string;
  image?: string | null;
  views?: number | null;
  boost_expires_at?: string | null;
  rank_score?: number | null;
  owner_id?: string;
};

type Profile = {
  id: string;
  role: "creator" | "brand" | "advertiser" | "admin";
};

export default function DashboardPage() {
  const router = useRouter();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [boostOpen, setBoostOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push("/auth/login");
      return;
    }

    setUser(user);

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profileData) {
      router.push("/onboarding");
      return;
    }

    setProfile(profileData);

    if (profileData.role === "admin") {
      router.push("/admin");
      return;
    }

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Listings error:", error.message);
      setLoading(false);
      return;
    }

    setListings(data ?? []);
    setLoading(false);
  }

  async function deleteListing(id: string) {
    const ok = confirm("Delete this listing?");
    if (!ok) return;

    await supabase.from("listings").delete().eq("id", id);

    setListings((prev) => prev.filter((x) => x.id !== id));
  }

  function openBoost(id: string) {
    setSelectedListing(id);
    setBoostOpen(true);
  }

  function closeBoost() {
    setBoostOpen(false);
    setSelectedListing(null);
  }

  function isBoosted(item: Listing) {
    if (!item.boost_expires_at) return false;
    return new Date(item.boost_expires_at).getTime() > Date.now();
  }

  async function startChat(listing: Listing) {
    if (!user) return;

    if (!listing.owner_id) {
      alert("Seller not found");
      return;
    }

    try {
      const conversation = await getOrCreateConversation({
        listingId: listing.id,
        buyerId: user.id,
        sellerId: listing.owner_id,
      });

      router.push(`/messages/${conversation.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to start chat");
    }
  }

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

    return Number(
      (
        listings.reduce((s, l) => s + (l.rank_score || 0), 0) /
        listings.length
      ).toFixed(1)
    );
  }, [listings]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-10 space-y-10">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-white/40 text-sm">
            Role: {profile?.role}
          </p>
        </div>

        <Link
          href="/listings"
          className="px-4 py-2 bg-blue-600 rounded-lg"
        >
          + Create Listing
        </Link>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Stat label="Listings" value={listings.length} />
        <Stat label="Views" value={totalViews} />
        <Stat label="Boosted" value={boostedCount} />
        <Stat label="Avg Rank" value={avgRank} />
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {listings.map((item) => (
          <div
            key={item.id}
            className="border border-white/10 bg-white/5 rounded-xl p-4"
          >
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-white/40 text-sm">{item.location}</p>
            <p className="text-blue-400 font-bold">{item.price}</p>

            <button
              onClick={() => startChat(item)}
              className="mt-3 w-full px-3 py-2 bg-green-600 rounded"
            >
              💬 Chat Seller
            </button>

            <button
              onClick={() => openBoost(item.id)}
              className="mt-2 w-full px-3 py-2 bg-yellow-500 text-black rounded"
            >
              Boost
            </button>

            <button
              onClick={() => deleteListing(item.id)}
              className="mt-2 w-full px-3 py-2 bg-red-600 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {boostOpen && selectedListing && (
        <BoostModal
          open={boostOpen}
          onClose={closeBoost}
          listingId={selectedListing}
        />
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
      <p className="text-white/40 text-sm">{label}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}