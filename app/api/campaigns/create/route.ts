import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();

  const {
    user_id,
    listing_id,
    title,
    budget,
    duration_days,
  } = body;

  const end_date = new Date();
  end_date.setDate(end_date.getDate() + duration_days);

  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      user_id,
      listing_id,
      title,
      budget,
      end_date,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  // attach campaign + boost listing
  await supabase
    .from("listings")
    .update({
      campaign_id: data.id,
      boost_score: 50,
    })
    .eq("id", listing_id);

  return NextResponse.json(data);
}