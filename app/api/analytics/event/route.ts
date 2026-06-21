import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const { listingId, type } = await req.json();

  if (!listingId || !type) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  // 1. log event (optional but powerful)
  await supabase.from("boost_events").insert({
    listing_id: listingId,
    event_type: type,
  });

  // 2. update aggregated stats
  const column =
    type === "click"
      ? "clicks"
      : type === "impression"
      ? "impressions"
      : type === "conversion"
      ? "conversions"
      : null;

  if (!column) {
    return NextResponse.json({ error: "Unknown event" }, { status: 400 });
  }

  await supabase.rpc("increment_boost_metric", {
    row_id: listingId,
    column_name: column,
  });

  return NextResponse.json({ success: true });
}