import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new NextResponse("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const listingId = session.metadata?.listingId;
    const plan = session.metadata?.plan;

    if (!listingId) return NextResponse.json({ ok: false });

    const boostValue = plan === "premium" ? 20 : 10;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (plan === "premium" ? 7 : 3));

    await supabase.from("listings").update({
      boost_score: boostValue,
      boost_expires_at: expiresAt.toISOString(),
    }).eq("id", listingId);
  }

  return NextResponse.json({ received: true });
}