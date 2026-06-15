import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    let { conversationId, amount } = body;

    // 🔥 SAFE CONVERSION
    amount = Number(amount);

    if (!conversationId || !amount) {
      return NextResponse.json(
        { error: "Missing conversationId or amount" },
        { status: 400 }
      );
    }

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_URL" },
        { status: 500 }
      );
    }

    // 💳 CREATE STRIPE SESSION
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `AdSphere Boost - Conversation ${conversationId}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],

      metadata: {
        conversationId,
      },

      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);

    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}