import { NextResponse } from "next/server";
import Stripe from "stripe";
import { activateBoost } from "@/lib/boost/activateBoost";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 }
    );
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
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  /* =========================
     BOOST SUCCESS EVENT
  ========================= */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const listingId = session.metadata?.listingId;
    const plan = session.metadata?.plan;

    if (!listingId || !plan) {
      return NextResponse.json(
        { error: "Missing metadata in session" },
        { status: 400 }
      );
    }

    await activateBoost({
      listingId,
      plan: plan as "basic" | "pro" | "premium",
      provider: "stripe",
    });
  }

  return NextResponse.json({ received: true });
}