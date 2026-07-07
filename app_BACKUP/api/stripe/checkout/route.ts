import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

/* =========================
   ENV SAFETY
========================= */
const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

/* =========================
   STRIPE CLIENT
========================= */
const stripe = new Stripe(secretKey, {
  apiVersion: "2026-05-27.dahlia",
});

/* =========================
   PRICES
========================= */
const BOOST_PRICES: Record<string, number> = {
  basic: 500,
  premium: 1200,
};

/* =========================
   MAIN ROUTE
========================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const listingId = body?.listingId;
    const userId = body?.userId;
    const plan = body?.plan;
    const agreementId = body?.agreementId ?? undefined;

    /* =========================
       VALIDATION
    ========================= */
    if (!listingId || !userId || !plan) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const amount = BOOST_PRICES[plan];

    if (!amount) {
      return NextResponse.json(
        { success: false, error: "Invalid plan" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    /* =========================
       STRIPE SESSION
    ========================= */
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Adspheria Boost (${plan})`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],

      success_url: `${baseUrl}/boost/success`,
      cancel_url: `${baseUrl}/boost/cancel`,

      /* =========================
         METADATA (IMPORTANT FOR WEBHOOKS)
      ========================= */
      metadata: {
        listingId: String(listingId),
        userId: String(userId),
        plan: String(plan),
        type: "boost",
        agreementId: agreementId ? String(agreementId) : "",
      },
    });

    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);

    return NextResponse.json(
      {
        success: false,
        error: err?.message ?? "Internal server error",
      },
      { status: 500 }
    );
  }
}

