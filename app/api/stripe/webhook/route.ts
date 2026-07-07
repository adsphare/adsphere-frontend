import Stripe from "stripe";
import { NextResponse } from "next/server";

import { escrowEngine } from "@/lib/domain/escrow/escrowEngine";
import { agreementEngine } from "@/lib/agreements/agreementEngine";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/* =========================
   ENV CHECK
========================= */
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET");
}

/* =========================
   STRIPE INIT
========================= */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* =========================
   TYPES
========================= */
type MetaType = "escrow" | "agreement" | "boost";

/* =========================
   WEBHOOK
========================= */
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 }
      );
    }

    /* =========================
       VERIFY EVENT
    ========================= */
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const eventId = event.id;

    /* =========================
       IDEMPOTENCY CHECK
    ========================= */
    const { data: existing } = await supabaseAdmin
      .from("stripe_events")
      .select("id")
      .eq("id", eventId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ received: true });
    }

    await supabaseAdmin.from("stripe_events").insert({
      id: eventId,
      type: event.type,
      created_at: new Date().toISOString(),
    });

    /* =========================
       CHECKOUT SUCCESS
    ========================= */
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const type = session.metadata?.type as MetaType;

      /* =========================
         ESCROW FLOW
      ========================= */
      if (type === "escrow") {
        const escrowId = session.metadata?.escrowId;

        if (!escrowId) {
          console.error("Missing escrowId");
          return NextResponse.json({ received: true });
        }

        await escrowEngine("RELEASE", escrowId);

        console.log("💰 ESCROW RELEASED:", escrowId);
      }

      /* =========================
         AGREEMENT FLOW
      ========================= */
      if (type === "agreement") {
        const agreementId = session.metadata?.agreementId;

        if (!agreementId) {
          console.error("Missing agreementId");
          return NextResponse.json({ received: true });
        }

        await agreementEngine("ACCEPT", agreementId);

        console.log("📄 AGREEMENT ACCEPTED:", agreementId);
      }

      /* =========================
         BOOST FLOW
      ========================= */
      if (type === "boost") {
        const listingId = session.metadata?.listingId;

        if (!listingId) {
          console.error("Missing listingId");
          return NextResponse.json({ received: true });
        }

        await supabaseAdmin
          .from("listings")
          .update({
            boosted: true,
            boosted_at: new Date().toISOString(),
          })
          .eq("id", listingId);

        console.log("🚀 BOOST ACTIVATED:", listingId);
      }
    }

    /* =========================
       PAYMENT FAILED
    ========================= */
    if (event.type === "payment_intent.payment_failed") {
      console.log("❌ Payment failed:", event.id);
    }

    /* =========================
       REFUND
    ========================= */
    if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      console.log("🔁 Refund:", charge.id);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);

    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 }
    );
  }
}