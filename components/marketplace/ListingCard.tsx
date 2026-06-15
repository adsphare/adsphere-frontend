"use client";

import Link from "next/link";
import CreateCampaignButton from "@/components/campaign/CreateCampaignButton";

type Listing = {
  id: string;
  title: string;
  location: string;
  price: string;
  type?: string;
  views?: number;
  boost_score?: number;
  boost_expires_at?: string;
};

function isBoostActive(listing: Listing) {
  if (!listing?.boost_score || listing.boost_score <= 0) return false;
  if (!listing.boost_expires_at) return true;

  return new Date(listing.boost_expires_at) > new Date();
}

export default function ListingCard({ item }: { item: Listing }) {
  if (!item) return null;

  const boosted = isBoostActive(item);

  return (
    <div className="relative">

      {/* BOOST BADGE */}
      {boosted && (
        <div className="absolute top-3 left-3 bg-yellow-400 text-black text-xs px-2 py-1 rounded font-bold z-10">
          🚀 BOOSTED
        </div>
      )}

      {/* CARD LINK */}
      <Link href={`/marketplace/${item.id}`}>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer group">

          {/* TITLE */}
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400">
            {item.title}
          </h3>

          {/* LOCATION */}
          <p className="text-gray-400 text-sm mt-2">
            📍 {item.location}
          </p>

          {/* PRICE */}
          <p className="text-blue-400 font-semibold mt-4 text-lg">
            {item.price}
          </p>

          {/* TYPE + VIEWS */}
          <div className="flex justify-between items-center mt-4">

            {item.type && (
              <div className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {item.type}
              </div>
            )}

            <div className="text-xs text-gray-400">
              👁 {item.views || 0}
            </div>

          </div>
        </div>
      </Link>

      {/* ACTIONS (OUTSIDE LINK — FIXED BUG) */}
      <div className="mt-3 flex justify-between items-center px-2">

        <button
          disabled
          className="text-xs px-3 py-1 rounded bg-yellow-500 text-black font-medium opacity-60 cursor-not-allowed"
        >
          🚀 Boost (Soon)
        </button>

        <CreateCampaignButton listingId={item.id} />
      </div>

    </div>
  );
}