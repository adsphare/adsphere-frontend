import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {

});

export async function POST(req: Request) {
  const { listingId, userId, plan } = await req.json();

  if (!listingId || !userId || !plan) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const prices: Record<string, number> = {
    basic: 500,   // $5.00
    premium: 1200, // $12.00
  };

  const amount = prices[plan];

  if (!amount) {
    return NextResponse.json(
      { error: "Invalid plan" },
      { status: 400 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Adsphere Boost (${plan})`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],

    success_url: `${process.env.NEXT_PUBLIC_URL}/boost/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/boost/cancel`,

    metadata: {
      listingId,
      userId,
      plan,
      type: "boost",
    },
  });

  return NextResponse.json({ url: session.url });
}