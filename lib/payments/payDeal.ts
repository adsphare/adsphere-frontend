import { createPayment } from "./payment.service";
import type { PaymentProvider } from "./types";

/* =========================
   PAY DEAL INPUT
========================= */
export type PayDealInput = {
  provider: PaymentProvider;

  escrowId: string;
  userId: string;

  amount: number;
  currency?: string;

  email?: string;
  firstName?: string;
  lastName?: string;
};

/* =========================
   PAY DEAL (MAIN ENTRY)
========================= */
export async function payDeal(input: PayDealInput) {
  const {
    provider,
    escrowId,
    userId,
    amount,
    currency = "usd",
    email,
    firstName,
    lastName,
  } = input;

  if (!escrowId || !userId || !amount) {
    throw new Error("Missing required payment fields");
  }

  /* =========================
     CREATE PAYMENT SESSION
  ========================= */
  const result = await createPayment({
    provider,
    amount,
    currency,
    userId,
    escrowId,
    email,
    firstName,
    lastName,
  });

  /* =========================
     CLEAN RETURN (NO DUPLICATE KEYS)
  ========================= */
  const { provider: _ignored, ...safeResult } = result;

  return {
    success: true,
    provider,
    escrowId,
    ...safeResult,
  };
}