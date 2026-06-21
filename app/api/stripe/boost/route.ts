import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

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

    const priceMap: Record<string, number> = {
      basic: 500,
      pro: 1000,
      premium: 2500,
    };

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
            unit_amount: priceMap[plan],
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
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { success: false, message: "Stripe init failed" },
      { status: 500 }
    );
  }
}