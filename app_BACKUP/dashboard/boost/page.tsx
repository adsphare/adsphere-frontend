"use client";

import { useEffect, useState, useMemo } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import BoostModal from "@/components/BoostModal";

type Listing = {
  id: string;
  title: string;
  location: string;
  price: string;
  image?: string;
  is_boosted?: boolean;
  boost_expires_at?: string | null;
};

export default function BoostPage() {
  const supabase = useMemo(() => createBrowserSupabase(), []);

  const [userId, setUserId] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const [openBoost, setOpenBoost] = useState(false);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    setUserId(user.id);
    await fetchListings(user.id);
  }

  async function fetchListings(uid: string) {
    setLoading(true);

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setListings((data as Listing[]) || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        Loading boosts...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Boost Center 🚀</h1>

      {listings.length === 0 ? (
        <p className="text-white/40">No listings found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {listings.map((item) => {
            const isActive =
              item.is_boosted &&
              item.boost_expires_at &&
              new Date(item.boost_expires_at).getTime() > Date.now();

            return (
              <div
                key={item.id}
                className="border border-white/10 bg-white/5 rounded-xl overflow-hidden"
              >
                <div className="h-40 bg-black">
                  {item.image ? (
                    <img src={item.image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white/30">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-white/40 text-sm">{item.location}</p>
                  <p className="text-blue-400 font-bold mt-2">{item.price}</p>

                  <div className="mt-3">
                    {isActive ? (
                      <span className="text-xs px-2 py-1 bg-green-500 text-black rounded">
                        🚀 Boost Active
                      </span>
                    ) : (
                      <span className="text-xs text-white/40">
                        Not boosted
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedListing(item.id);
                      setOpenBoost(true);
                    }}
                    className="w-full mt-4 px-3 py-2 bg-blue-500 text-black rounded"
                  >
                    Boost 🚀
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedListing && (
        <BoostModal
          open={openBoost}
          onClose={() => {
            setOpenBoost(false);
            setSelectedListing(null);
          }}
          listingId={selectedListing}
          
        />
      )}
    </main>
  );
}

