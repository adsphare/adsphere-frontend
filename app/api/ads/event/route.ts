import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

const VALID_EVENTS = [
  "impression",
  "click",
  "conversion",
  "view",
  "boost_impression",
] as const;

type EventType = (typeof VALID_EVENTS)[number];

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabase();

    const body = await req.json();
    const {
      listingId,
      eventType,
      userId,
      metadata,
    }: {
      listingId?: string;
      eventType?: EventType;
      userId?: string;
      metadata?: Record<string, any>;
    } = body;

    // 1. Validation
    if (!listingId || !eventType) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    // 2. Event validation (type-safe)
    if (!VALID_EVENTS.includes(eventType)) {
      return NextResponse.json(
        { success: false, message: "Invalid event type" },
        { status: 400 }
      );
    }

    // 3. Insert event
    const { error } = await supabase.from("ad_events").insert({
      listing_id: listingId,
      event_type: eventType,
      user_id: userId ?? null,
      metadata: metadata ?? {},
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Ad event insert error:", error.message);

      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Ad event crash:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Server error",
      },
      { status: 500 }
    );
  }
}