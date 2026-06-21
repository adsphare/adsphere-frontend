import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { activateBoost } from "@/lib/boost/activateBoost";
import { updateRank } from "@/lib/ranking/updateRank";
import { createNotification } from "@/lib/notifications/notifications";
import { NotificationTypes } from "@/lib/notifications/types";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
 
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
     PAYMENT SUCCESS FLOW
  ========================= */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const listingId = session.metadata?.listingId;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (!listingId || !userId || !plan) {
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
      amount: 0,
      status: "paid",
      provider: "stripe",
      created_at: new Date().toISOString(),
    });

    /* =========================
       2. BOOST LISTING
    ========================= */
    await activateBoost({
      listingId,
      plan: plan as "basic" | "pro" | "premium",
    });

    /* =========================
       3. UPDATE RANK
    ========================= */
    await updateRank(listingId);

    /* =========================
       4. NOTIFY USER
    ========================= */
    await createNotification({
      userId,
      title: "Boost Activated 🚀",
      message: `Your listing is now boosted (${plan}).`,
      type: NotificationTypes.BOOST,
      link: `/dashboard`,
    });
  }

  return NextResponse.json({ received: true });
}