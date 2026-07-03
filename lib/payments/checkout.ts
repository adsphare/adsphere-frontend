import { createPayment } from "./payment.service";
import type { PaymentProvider } from "./types";

type CheckoutInput = {
  provider: PaymentProvider;

  escrowId: string;
  userId: string;

  amount: number;
  currency?: string;

  // Required for Chapa
  email?: string;
  firstName?: string;
  lastName?: string;
};

export async function createCheckoutSession(input: CheckoutInput) {
  const result = await createPayment({
    provider: input.provider,
    escrowId: input.escrowId,
    userId: input.userId,
    amount: input.amount,
    currency: input.currency ?? "usd",

    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
  });

  if (!result.checkoutUrl) {
    throw new Error("Failed to create checkout session");
  }

  return result;
}




