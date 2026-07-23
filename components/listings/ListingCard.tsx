"use client";

import { useEffect, useState } from "react";
import { trustScore } from "@/lib/core/trust/trustScore";
import { useRouter } from "next/navigation";

type Listing = {
  id: string;
  title: string;
  location: string;
  user_id: string;
  rank?: number;
};

export default function ListingCard({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [trust, setTrust] = useState(50);

  useEffect(() => {
    trustScore.get(listing.user_id).then(setTrust);
  }, [listing.user_id]);

  const isHighTrust = trust >= 80;

  return (
    <div
      className={`p-4 border rounded-xl transition
        ${isHighTrust
          ? "border-green-500/50 bg-green-500/10"
          : "border-white/10 bg-white/5"
        }`}
    >

      {/* TITLE */}
      <h2 className="font-semibold flex items-center gap-2">
        {listing.title}

        {/* VERIFIED BADGE */}
        {isHighTrust && (
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
            Verified
          </span>
        )}
      </h2>

      {/* LOCATION */}
      <p className="text-white/60 text-sm">
        {listing.location}
      </p>

      {/* TRUST SCORE */}
      <p className="text-xs mt-1 text-white/50">
        Trust: {trust}/100
      </p>

      {/* RANK (optional debug) */}
      {listing.rank && (
        <p className="text-xs text-blue-400 mt-1">
          Rank: {listing.rank.toFixed(1)}
        </p>
      )}

      {/* BUTTON */}
      <button
        onClick={() => router.push(`/marketplace/${listing.id}`)}
        className="mt-3 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        View
      </button>
    </div>
  );
}

