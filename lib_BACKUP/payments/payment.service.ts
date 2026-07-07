import { createChapaCheckout } from "@/lib/infrastructure/chapa/checkout";
import { stripe } from "@/lib/infrastructure/stripe/client";

import type { CreatePaymentInput } from "./types";

export async function createPayment(input: CreatePaymentInput) {
  const {
    provider,
    amount,
    currency = "usd",
    escrowId,
    email,
    firstName,
    lastName,
  } = input;

  if (!escrowId) throw new Error("Missing escrowId");
  if (amount <= 0) throw new Error("Invalid payment amount");

  const paymentReference = `escrow_${escrowId}_${Date.now()}`;

  /* =========================
     STRIPE
  ========================= */
  if (provider === "stripe") {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: "Escrow Payment" },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        escrowId,
        paymentReference,
        provider: "stripe",
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    });

    if (!session.url) throw new Error("Stripe did not return URL");

    return {
      provider: "stripe" as const,
      checkoutUrl: session.url,
      paymentReference,
    };
  }

  /* =========================
     CHAPA
  ========================= */
  if (!email || !firstName || !lastName) {
    throw new Error("Missing Chapa customer information");
  }

  const chapa = await createChapaCheckout({
    amount,
    currency,
    email,
    first_name: firstName,
    last_name: lastName,
    tx_ref: paymentReference,
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/chapa/webhook`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
  });

  if (!chapa?.checkoutUrl) {
    throw new Error("Chapa did not return checkout URL");
  }

  return {
    provider: "chapa" as const,
    checkoutUrl: chapa.checkoutUrl,
    paymentReference,
  };
}

