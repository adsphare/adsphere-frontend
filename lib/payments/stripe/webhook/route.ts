import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // =========================
    // HANDLE EVENTS
    // =========================

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        console.log("Payment successful:", session.id);

        // TODO: Activate boost or mark deal as paid
        break;
      }

      case "payment_intent.payment_failed": {
        console.log("Payment failed");
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err);

    return NextResponse.json(
      { error: err.message || "Webhook failed" },
      { status: 400 }
    );
  }
}





