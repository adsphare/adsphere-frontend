import { NextResponse } from "next/server";
import { stripe } from "@/lib/infrastructure/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { listingId, plan } = await req.json();

    if (!listingId || !plan) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      );
    }

    // 💰 centralized pricing
    const priceMap: Record<string, number> = {
      basic: 500,
      pro: 1000,
      premium: 2500,
    };

    const amount = priceMap[plan];

    if (!amount) {
      return NextResponse.json(
        { success: false, message: "Invalid plan" },
        { status: 400 }
      );
    }

    // 💳 create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Boost (${plan})`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],

      metadata: {
        listingId,
        plan,
        provider: "stripe",
      },

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/marketplace?boost=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/marketplace`,
    });

    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (err: any) {
    console.error("Stripe error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Stripe init failed",
      },
      { status: 500 }
    );
  }
}






