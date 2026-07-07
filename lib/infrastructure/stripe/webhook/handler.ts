import Stripe from "stripe";
import { stripe } from "@/lib/infrastructure/stripe/client";
import { STRIPE_WEBHOOK_EVENTS } from "@/lib/infrastructure/stripe/webhook/events";
import { escrowEngine } from "@/lib/domain/escrow/escrowEngine";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function handleStripeWebhook(event: Stripe.Event) {
  /* =========================
     1. IDEMPOTENCY CHECK
  ========================= */

  const { data: existing } = await supabaseAdmin
    .from("stripe_events")
    .select("id")
    .eq("id", event.id)
    .maybeSingle();

  if (existing) {
    console.log("🔁 Duplicate event ignored:", event.id);
    return;
  }

  /* Save event immediately */
  await supabaseAdmin.from("stripe_events").insert({
    id: event.id,
    type: event.type,
    processed_at: new Date().toISOString(),
  });

  /* =========================
     2. BUSINESS LOGIC
  ========================= */

  switch (event.type) {
    case STRIPE_WEBHOOK_EVENTS.CHECKOUT_SESSION_COMPLETED: {
      const session = event.data.object as Stripe.Checkout.Session;

      const escrowId = session.metadata?.escrowId;

      if (!escrowId) {
        console.error("Missing escrowId");
        return;
      }

      await escrowEngine("FUND", escrowId);

      console.log("💰 Escrow funded:", escrowId);
      break;
    }

    case STRIPE_WEBHOOK_EVENTS.PAYMENT_INTENT_FAILED: {
      console.log("❌ Payment failed");
      break;
    }

    case STRIPE_WEBHOOK_EVENTS.REFUND_CREATED: {
      console.log("🔁 Refund processed");
      break;
    }

    default:
      console.log("Unhandled event:", event.type);
  }
}





