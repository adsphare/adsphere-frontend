import { createClient } from "@/lib/supabase/server";

export async function trackBoostImpression(listing: any) {
  if (!listing.is_boosted) return;

  const supabase = await createClient();

  await supabase.rpc("increment_boost_impressions", {
    listing_id_input: listing.id,
  });
}