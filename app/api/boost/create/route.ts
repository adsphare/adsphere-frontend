import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const body = await req.json();
    const { userId, listingId, plan, amount } = body;

    if (!userId || !listingId || !plan) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("boosts")
      .insert({
        user_id: userId,
        listing_id: listingId,
        plan,
        amount,
        status: "pending",
        created_at: new Date(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ boost: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}