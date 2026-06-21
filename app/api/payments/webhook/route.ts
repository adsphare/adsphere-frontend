import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { activateBoost } from "@/lib/boost/activateBoost";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }

  /* =========================
     PAYMENT SUCCESS
  ========================= */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const listingId = session.metadata?.listingId;
    const userId = session.metadata?.userId;
    const amount = session.metadata?.amount;

    if (!listingId || !userId) {
      return NextResponse.json(
        { error: "Missing metadata" },
        { status: 400 }
      );
    }

    /* =========================
       1. SAVE PAYMENT
    ========================= */
    await supabase.from("payments").insert({
      listing_id: listingId,
      user_id: userId,
      amount: Number(amount),
      status: "paid",
      provider: "stripe",
      created_at: new Date().toISOString(),
    });

    /* =========================
       2. ACTIVATE BOOST OR FEATURE
    ========================= */
    await activateBoost({
      listingId,
      plan: "basic",
      provider: "stripe",
    });
  }

  return NextResponse.json({ received: true });
}