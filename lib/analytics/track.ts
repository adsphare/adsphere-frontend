import { createServerSupabase } from "@/lib/supabase/server";

/* =========================
   TRACK IMPRESSION
========================= */
export async function trackImpression(listingId: string) {
  const supabase = await createServerSupabase();

  await supabase.rpc("increment_impressions", {
    row_id: listingId,
  });

  await supabase.from("boost_analytics").upsert(
    {
      listing_id: listingId,
      impressions: 1,
    },
    {
      onConflict: "listing_id",
    }
  );
}

/* =========================
   TRACK CLICK
========================= */
export async function trackClick(listingId: string) {
  const supabase = await createServerSupabase();

  await supabase.rpc("increment_clicks", {
    row_id: listingId,
  });

  await supabase.from("boost_analytics").upsert(
    {
      listing_id: listingId,
      clicks: 1,
    },
    {
      onConflict: "listing_id",
    }
  );
}

/* =========================
   TRACK CONVERSION
========================= */
export async function trackConversion(listingId: string) {
  const supabase = await createServerSupabase();

  await supabase.rpc("increment_conversions", {
    row_id: listingId,
  });

  await supabase.from("boost_analytics").upsert(
    {
      listing_id: listingId,
      conversions: 1,
    },
    {
      onConflict: "listing_id",
    }
  );
}






