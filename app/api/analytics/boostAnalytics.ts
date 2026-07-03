import { createServerSupabase } from "@/lib/supabase/server";

export type BoostTrackType =
  | "impression"
  | "click"
  | "conversion";

/* =========================
   IMPRESSION TRACK
========================= */
export async function trackBoostImpression(
  listingId: string
) {
  try {
    const supabase = createServerSupabase();

    const { error } = await supabase.rpc(
      "increment_boost_impressions",
      {
        row_id: listingId,
      }
    );

    if (error) {
      console.error(
        "Boost impression error:",
        error.message
      );
    }
  } catch (err: any) {
    console.error(
      "Boost impression crash:",
      err?.message
    );
  }
}

/* =========================
   CLICK TRACK
========================= */
export async function trackBoostClick(
  listingId: string
) {
  try {
    const supabase = createServerSupabase();

    const { error } = await supabase.rpc(
      "increment_boost_clicks",
      {
        row_id: listingId,
      }
    );

    if (error) {
      console.error(
        "Boost click error:",
        error.message
      );
    }
  } catch (err: any) {
    console.error(
      "Boost click crash:",
      err?.message
    );
  }
}

/* =========================
   CONVERSION TRACK
========================= */
export async function trackBoostConversion(
  listingId: string
) {
  try {
    const supabase = createServerSupabase();

    const { error } = await supabase.rpc(
      "increment_boost_conversions",
      {
        row_id: listingId,
      }
    );

    if (error) {
      console.error(
        "Boost conversion error:",
        error.message
      );
    }
  } catch (err: any) {
    console.error(
      "Boost conversion crash:",
      err?.message
    );
  }
}





