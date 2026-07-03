import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "../client";
import { handleStripeWebhook } from "./handler";

export const runtime = "nodejs";

/* =========================
   ENV SAFETY
========================= */

// ✅ FIX: force string type (removes string | undefined error)
const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

/* =========================
   WEBHOOK ROUTE
========================= */

export async function POST(req: Request) {
  try {
    const body = await req.text();

    const signature = req.headers.get("stripe-signature");

    // ✅ FIX: narrow string | null → string
    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err: any) {
      console.error("Webhook verification failed:", err.message);

      return NextResponse.json(
        { error: "Invalid Stripe signature" },
        { status: 400 }
      );
    }

    await handleStripeWebhook(event);

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Stripe webhook error:", err);

    return NextResponse.json(
      { error: err?.message || "Webhook failed" },
      { status: 500 }
    );
  }
}




