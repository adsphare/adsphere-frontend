export const PAYMENT_EVENT_TYPES = {
  // Stripe
  CHECKOUT_SUCCESS: "checkout.session.completed",
  PAYMENT_FAILED: "payment_intent.payment_failed",

  // Chapa (custom mapping)
  CHAPA_SUCCESS: "chapa.payment.success",
  CHAPA_FAILED: "chapa.payment.failed",
} as const;

export type PaymentEventType =
  (typeof PAYMENT_EVENT_TYPES)[keyof typeof PAYMENT_EVENT_TYPES];




