import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import type { Dispatch, SetStateAction } from "react";

/* =========================
   LISTING TYPE
========================= */
export type Listing = {
  id: string;
  title: string;
  location: string;
  price?: string;
  image?: string;
  rank_score?: number;
};

/* =========================
   REALTIME HOOK FACTORY
========================= */
export function useListingsRealtime(
  setListings: Dispatch<SetStateAction<Listing[]>>
) {
  return (payload: RealtimePostgresChangesPayload<Listing>) => {
    const newRow = payload.new;

    // safety check (fixes {} | Listing issue)
    if (!newRow || typeof newRow !== "object" || !("id" in newRow)) return;

    const listing = newRow as Listing;

    setListings((prev) =>
      prev.map((item) =>
        item.id === listing.id
          ? { ...item, ...listing }
          : item
      )
    );
  };
}






