import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase/server";

// ✅ SAFE Stripe init (NO apiVersion → fixes your TS error)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export type BoostPlan = "basic" | "pro" | "premium";

export interface CreateStripeBoostInput {
  listingId: string;
  plan: BoostPlan;
  successUrl: string;
  cancelUrl: string;
}

export interface ChapaVerifyInput {
  tx_ref: string;
  listingId: string;
  plan: BoostPlan;
}

export const paymentService = {
  /* =========================
     STRIPE BOOST
  ========================= */
  async createStripeBoostSession(input: CreateStripeBoostInput) {
    const priceMap: Record<BoostPlan, number> = {
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
              name: `Boost (${input.plan})`,
            },
            unit_amount: priceMap[input.plan],
          },
          quantity: 1,
        },
      ],

      metadata: {
        listingId: input.listingId,
        plan: input.plan,
        provider: "stripe",
      },

      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
    });

    return {
      url: session.url,
      id: session.id,
    };
  },

  /* =========================
     CHAPA VERIFY
  ========================= */
  async verifyChapaPayment(input: ChapaVerifyInput) {
    const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY!;

    const res = await fetch(
      `https://api.chapa.co/v1/transaction/verify/${input.tx_ref}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Chapa verification request failed");
    }

    const data = await res.json();

    const isPaid =
      data?.status === "success" &&
      data?.data?.status === "success";

    if (!isPaid) {
      throw new Error("Payment not confirmed");
    }

    return {
      success: true,
      data,
    };
  },
};






