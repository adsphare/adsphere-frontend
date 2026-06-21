import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { dealId, amount } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Marketplace Deal",
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_URL}/success?deal=${dealId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
  });

  return NextResponse.json({
    url: session.url,
    sessionId: session.id,
  });
}