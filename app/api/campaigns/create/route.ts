import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      user_id,
      listing_id,
      title,
      budget,
      duration_days,
    } = body;

    if (!user_id || !listing_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const end_date = new Date();
    end_date.setDate(end_date.getDate() + Number(duration_days || 0));

    const { data, error } = await supabase
      .from("campaigns")
      .insert({
        user_id,
        listing_id,
        title,
        budget,
        end_date: end_date.toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    await supabase
      .from("listings")
      .update({
        campaign_id: data.id,
        boost_score: 50,
      })
      .eq("id", listing_id);

    return NextResponse.json(data);
  } catch (err) {
    console.error("Campaign create error:", err);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}