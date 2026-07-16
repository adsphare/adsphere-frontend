import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();

    const { conversationId } = await req.json();

    if (!conversationId) {
      return NextResponse.json(
        { error: "Missing conversationId" },
        { status: 400 }
      );
    }

    // 1. GET CONVERSATION
    const { data: convo, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    if (error || !convo) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    if (convo.escrow_status !== "locked") {
      return NextResponse.json(
        { error: "Escrow not locked" },
        { status: 400 }
      );
    }

    // 2. GET SELLER STRIPE ACCOUNT
    const { data: seller, error: sellerError } = await supabase
      .from("profiles")
      .select("stripe_account_id")
      .eq("id", convo.seller_id)
      .single();

    if (sellerError || !seller?.stripe_account_id) {
      return NextResponse.json(
        { error: "Seller not connected to Stripe" },
        { status: 400 }
      );
    }

    // 3. SAFE AMOUNT HANDLING
    const amountInCents = Math.round(Number(convo.amount));

    if (!amountInCents || amountInCents <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // 4. STRIPE TRANSFER (ESCROW RELEASE)
    const transfer = await stripe.transfers.create({
      amount: amountInCents,
      currency: "usd",
      destination: seller.stripe_account_id,
      description: `Payout for conversation ${conversationId}`,
    });

    // 5. UPDATE DATABASE
    await supabase
      .from("conversations")
      .update({
        escrow_status: "released",
        released_at: new Date().toISOString(),
        stripe_transfer_id: transfer.id,
      })
      .eq("id", conversationId);

    return NextResponse.json({
      success: true,
      transferId: transfer.id,
    });
  } catch (err: any) {
    console.error("ESCROW RELEASE ERROR:", err);

    return NextResponse.json(
      {
        error: err?.message || "Release failed",
      },
      { status: 500 }
    );
  }
}






