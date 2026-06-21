import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const { listingId, eventType, userId, metadata } =
    await req.json();

  if (!listingId || !eventType) {
    return NextResponse.json(
      { success: false, message: "Missing fields" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("ad_events").insert({
    listing_id: listingId,
    event_type: eventType,
    user_id: userId || null,
    metadata: metadata || {},
  });

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}