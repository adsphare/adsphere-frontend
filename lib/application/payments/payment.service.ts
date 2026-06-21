import { createClient } from "@/lib/supabase/server";

export type PaymentProvider = "stripe" | "chapa";

export type CreatePaymentIntentInput = {
  campaignId: string;
  provider: PaymentProvider;
};

/* =========================
   PAYMENT DOMAIN SERVICE
========================= */
export const paymentService = {
  /* -------------------------
     CREATE PAYMENT INTENT
  ------------------------- */
  async createIntent(input: CreatePaymentIntentInput) {
    const supabase = await createClient();

    // 1. Create internal payment record first
    const { data: payment, error } = await supabase
      .from("payments")
      .insert({
        campaign_id: input.campaignId,
        provider: input.provider,
        status: "pending",
        amount: 0, // will be linked to campaign later
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // 2. Simulate external provider response (Stripe/Chapa later)
    const externalId =
      input.provider === "stripe"
        ? `stripe_${Date.now()}`
        : `chapa_${Date.now()}`;

    // 3. Update payment with provider reference
    await supabase
      .from("payments")
      .update({
        provider_ref: externalId,
      })
      .eq("id", payment.id);

    return {
      paymentId: payment.id,
      provider: input.provider,
      providerRef: externalId,
      status: "pending",
    };
  },

  /* -------------------------
     VERIFY PAYMENT (WEBHOOK READY)
  ------------------------- */
  async verifyPayment(paymentId: string) {
    const supabase = await createClient();

    const { data: payment, error } = await supabase
      .from("payments")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
      })
      .eq("id", paymentId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return payment;
  },
};