import { createServerSupabase } from "@/lib/supabase/server";

type Listing = {
  id: string;
  is_boosted?: boolean;
};

export async function trackBoostImpression(listing: Listing) {
  try {
    if (!listing?.is_boosted) return;
    if (!listing?.id) return;

    const supabase = createServerSupabase();

    const { error } = await supabase.rpc("increment_boost_impressions", {
      listing_id_input: listing.id,
    });

    if (error) {
      console.error("Boost impression error:", error.message);
      return;
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error";

    console.error("Boost impression crash:", message);
  }
}






