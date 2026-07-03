export const STRIPE_WEBHOOK_EVENTS = {
  CHECKOUT_SESSION_COMPLETED: "checkout.session.completed",
  PAYMENT_INTENT_SUCCEEDED: "payment_intent.succeeded",
  PAYMENT_INTENT_FAILED: "payment_intent.payment_failed",
  REFUND_CREATED: "charge.refunded",
} as const;

/* =========================
   TYPE (optional but useful)
========================= */
export type StripeWebhookEventType =
  (typeof STRIPE_WEBHOOK_EVENTS)[keyof typeof STRIPE_WEBHOOK_EVENTS];




