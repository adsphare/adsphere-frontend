import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

const VALID_PLANS = ["basic", "pro", "premium"] as const;

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabase();

    const { listingId, plan } = await req.json();

    if (!listingId || !plan) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      );
    }

    if (!VALID_PLANS.includes(plan)) {
      return NextResponse.json(
        { success: false, message: "Invalid plan" },
        { status: 400 }
      );
    }

    // ⏳ expiry logic (business rule stays here for now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { data, error } = await supabase
      .from("boosts")
      .update({
        status: "active",
        plan,
        expires_at: expiresAt.toISOString(),
      })
      .eq("listing_id", listingId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      boost: data,
    });
  } catch (error: any) {
    console.error("Boost error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Server error",
      },
      { status: 500 }
    );
  }
}






