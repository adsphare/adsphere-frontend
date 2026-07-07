import { NextResponse } from "next/server";

import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
const supabase = createServerSupabase();

  const { listingId, type } = await req.json();

  if (!listingId || !type) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  // 1. log event
  const { error: logError } = await supabase
    .from("boost_events")
    .insert({
      listing_id: listingId,
      event_type: type,
    });

  if (logError) {
    console.error("Boost event log error:", logError.message);
  }

  // 2. map event → column
  const column =
    type === "click"
      ? "clicks"
      : type === "impression"
      ? "impressions"
      : type === "conversion"
      ? "conversions"
      : null;

  if (!column) {
    return NextResponse.json(
      { error: "Unknown event" },
      { status: 400 }
    );
  }

  // 3. update stats safely
  const { error: rpcError } = await supabase.rpc(
    "increment_boost_metric",
    {
      row_id: listingId,
      column_name: column,
    }
  );

  if (rpcError) {
    console.error("RPC error:", rpcError.message);
  }

  return NextResponse.json({ success: true });
}






