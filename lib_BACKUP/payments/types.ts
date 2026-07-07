export type PaymentProvider = "stripe" | "chapa";

export type CreatePaymentInput = {
  provider: PaymentProvider;

  amount: number;
  currency: string;

  userId: string;
  escrowId: string;

  email?: string;
  firstName?: string;
  lastName?: string;
};





