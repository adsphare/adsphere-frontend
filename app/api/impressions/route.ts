import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase(); // ✅ FIXED

    const { listingId } = await req.json();

    if (!listingId) {
      return NextResponse.json(
        { success: false, message: "Missing listingId" },
        { status: 400 }
      );
    }

    // 🔥 atomic increment (RPC)
    const { error } = await supabase.rpc("increment_impressions", {
      listing_id_input: listingId,
    });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}






