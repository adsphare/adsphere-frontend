import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { listingId } = await req.json();

  const supabase = await createClient();

  // increment impressions safely
  const { data: current } = await supabase
    .from("listings")
    .select("impressions")
    .eq("id", listingId)
    .single();

  await supabase
    .from("listings")
    .update({
      impressions: (current?.impressions || 0) + 1,
    })
    .eq("id", listingId);

  return NextResponse.json({ success: true });
}