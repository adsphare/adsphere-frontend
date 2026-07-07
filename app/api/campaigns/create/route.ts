import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    // ✅ Supabase client must be INSIDE handler
     const supabase = createServerSupabase();

    const body = await req.json();

    const {
      user_id,
      listing_id,
      title,
      budget,
      duration_days,
    } = body;

    // ✅ validation
    if (!user_id || !listing_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ compute end date safely
    const endDate = new Date();
    endDate.setDate(
      endDate.getDate() + Number(duration_days || 0)
    );

    // ✅ create campaign
    const { data, error } = await supabase
      .from("campaigns")
      .insert({
        user_id,
        listing_id,
        title: title ?? "",
        budget: Number(budget ?? 0),
        end_date: endDate.toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // ✅ update listing safely
    await supabase
      .from("listings")
      .update({
        campaign_id: data.id,
        boost_score: 50,
      })
      .eq("id", listing_id);

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Campaign create error:", err);

    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}






