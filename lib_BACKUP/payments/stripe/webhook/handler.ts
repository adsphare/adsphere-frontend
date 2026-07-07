import { stripe } from "@/lib/infrastructure/stripe/client";
import { NextResponse } from "next/server";
import {
  isEventProcessed,
  markEventProcessed,
} from "@/lib/payments/webhookGuard";
import { escrowEngine } from "@/lib/domain/escrow/escrowEngine";

export async function handleStripeWebhook(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  /* =========================
     1. VERIFY STRIPE SIGNATURE
  ========================= */
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const eventId = event.id;

  /* =========================
     2. IDEMPOTENCY CHECK
  ========================= */
  if (await isEventProcessed(eventId)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  /* =========================
     3. ONLY HANDLE SUCCESS PAYMENTS
  ========================= */
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const session = event.data.object as {
    metadata?: {
      escrowId?: string;
    };
  };

  const escrowId = session.metadata?.escrowId;

  if (!escrowId) {
    return NextResponse.json(
      { error: "Missing escrowId" },
      { status: 400 }
    );
  }

  /* =========================
     4. LOCK EVENT (BEFORE BUSINESS LOGIC)
  ========================= */
  await markEventProcessed({
    id: eventId,
    provider: "stripe",
    escrowId,
    raw: event,
  });

  /* =========================
     5. BUSINESS LOGIC (ESCROW FUND)
  ========================= */
  await escrowEngine("FUND", escrowId);

  return NextResponse.json({ ok: true });
}

