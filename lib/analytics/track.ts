import { supabase } from "@/lib/supabase";

/* =========================
   TRACK IMPRESSION
========================= */
export async function trackImpression(listingId: string) {
  await supabase.rpc("increment_impressions", {
    row_id: listingId,
  });

  await supabase.from("boost_analytics").upsert({
    listing_id: listingId,
    impressions: 1,
  });
}

/* =========================
   TRACK CLICK
========================= */
export async function trackClick(listingId: string) {
  await supabase.rpc("increment_clicks", {
    row_id: listingId,
  });

  await supabase.from("boost_analytics").upsert({
    listing_id: listingId,
    clicks: 1,
  });
}

/* =========================
   TRACK CONVERSION
========================= */
export async function trackConversion(listingId: string) {
  await supabase.rpc("increment_conversions", {
    row_id: listingId,
  });

  await supabase.from("boost_analytics").upsert({
    listing_id: listingId,
    conversions: 1,
  });
}