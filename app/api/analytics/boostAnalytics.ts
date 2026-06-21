import { createClient } from "@/lib/supabase/server";

/* =========================
   IMPRESSION TRACK
========================= */
export async function trackBoostImpression(listingId: string) {
  const supabase = await createClient();

  await supabase.rpc("increment_boost_impressions", {
    row_id: listingId,
  });
}

/* =========================
   CLICK TRACK
========================= */
export async function trackBoostClick(listingId: string) {
  const supabase = await createClient();

  await supabase.rpc("increment_boost_clicks", {
    row_id: listingId,
  });
}

/* =========================
   CONVERSION TRACK
========================= */
export async function trackBoostConversion(listingId: string) {
  const supabase = await createClient();

  await supabase.rpc("increment_boost_conversions", {
    row_id: listingId,
  });
}