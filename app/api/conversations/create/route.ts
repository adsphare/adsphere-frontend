import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { listingId, buyerId, sellerId } = await req.json();

    if (!listingId || !buyerId || !sellerId) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // 🔥 SAFE CHECK (NO .single())
    const { data: existing, error: findError } = await supabase
      .from("conversations")
      .select("*")
      .eq("listing_id", listingId)
      .eq("buyer_id", buyerId)
      .eq("seller_id", sellerId)
      .maybeSingle(); // ✅ FIX

    if (findError) {
      return NextResponse.json(
        { error: findError.message },
        { status: 500 }
      );
    }

    // ✅ IF EXISTS RETURN IT
    if (existing) {
      return NextResponse.json(existing);
    }

    // 🆕 CREATE NEW CONVERSATION
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        listing_id: listingId,
        buyer_id: buyerId,
        seller_id: sellerId,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}