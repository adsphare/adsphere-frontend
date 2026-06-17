"use client";

<<<<<<< HEAD
import { useState } from "react";
import BoostButton from "@/components/BoostButton";
import PaymentModal from "@/components/PaymentModal";
import { supabase } from "@/lib/supabase";
=======
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BoostModal from "@/components/BoostModal";

type Listing = {
  id: string;
  title: string;
  location: string;
  price: string;
  image?: string;
  is_boosted?: boolean;
  boost_level?: number;
  boost_expires_at?: string | null;
};
>>>>>>> 6c58162 (refactor: move globals.css to app, add 3D scene system, stabilize layout architecture)

export default function BoostPage() {
  const [open, setOpen] = useState(false);

<<<<<<< HEAD
  // real user + listing should come from DB in your app
  const listingId = "demo-listing-id";
  const userId = "demo-user-id";
=======
  // MODAL STATE
  const [openBoost, setOpenBoost] = useState(false);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

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
  }

  async function fetchListings(uid: string) {
    setLoading(true);

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch listings error:", error);
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
>>>>>>> 6c58162 (refactor: move globals.css to app, add 3D scene system, stabilize layout architecture)

  return (
    <main className="min-h-screen bg-[#050816] text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Boost Center 🚀</h1>

      <BoostButton onClick={() => setOpen(true)} />

<<<<<<< HEAD
      <PaymentModal
        open={open}
        onClose={() => setOpen(false)}
        listingId={listingId}
        userId={userId}
      />
=======
        {/* EMPTY STATE */}
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

                  {/* IMAGE */}
                  <div className="h-40 bg-black">
                    {item.image ? (
                      <img
                        src={item.image}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-white/30">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">

                    <h3 className="font-semibold">{item.title}</h3>

                    <p className="text-white/40 text-sm">
                      {item.location}
                    </p>

                    <p className="text-blue-400 font-bold mt-2">
                      {item.price}
                    </p>

                    {/* BOOST STATUS */}
                    <div className="mt-3">
                      {isActive ? (
                        <span className="text-xs px-2 py-1 bg-green-500 text-black rounded inline-block">
                          🚀 Boost Active
                        </span>
                      ) : (
                        <span className="text-xs text-white/40">
                          Not boosted
                        </span>
                      )}
                    </div>

                    {/* EXPIRE INFO */}
                    {item.boost_expires_at && (
                      <p className="text-xs text-white/30 mt-2">
                        Expires:{" "}
                        {new Date(item.boost_expires_at).toLocaleDateString()}
                      </p>
                    )}

                    {/* BOOST BUTTON */}
                    <div className="mt-4">
                      {userId && (
                        <button
                          onClick={() => {
                            setSelectedListing(item.id);
                            setOpenBoost(true);
                          }}
                          className="w-full px-3 py-2 bg-blue-500 text-black rounded"
                        >
                          Boost 🚀
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        )}

        {/* MODAL */}
        {selectedListing && (
          <BoostModal
            open={openBoost}
            onClose={() => {
              setOpenBoost(false);
              setSelectedListing(null);
            }}
            listingId={selectedListing}
            userId={userId!}
          />
        )}

      </div>
>>>>>>> 6c58162 (refactor: move globals.css to app, add 3D scene system, stabilize layout architecture)
    </main>
  );
}