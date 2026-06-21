export type AdEventType =
  | "impression"
  | "click"
  | "conversion"
  | "boost_view"
  | "boost_click";import { createClient } from "@/lib/supabase/server";

export async function trackAdEvent(input: {
  listingId: string;
  type: "impression" | "click" | "conversion" | "boost_view" | "boost_click";
}) {
  const supabase = await createClient();

  /* =========================
     1. STORE EVENT (RAW DATA)
  ========================= */
  await supabase.from("ad_events").insert({
    listing_id: input.listingId,
    type: input.type,
    created_at: new Date().toISOString(),
  });

  /* =========================
     2. UPDATE COUNTERS (FAST PATH)
  ========================= */
  const updateMap: Record<string, any> = {
    impression: { impressions: "increment" },
    click: { clicks: "increment" },
    conversion: { conversions: "increment" },
    boost_view: { boost_views: "increment" },
    boost_click: { boost_clicks: "increment" },
  };

  const field = updateMap[input.type];

  if (!field) return;

  const column = Object.keys(field)[0];

  await supabase.rpc("increment_field", {
    table_name: "listings",
    row_id: input.listingId,
    column_name: column,
  });

  return { success: true };
}