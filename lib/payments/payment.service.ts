import { createClient } from "@/lib/supabase/server";

export type PaymentProvider = "stripe" | "chapa";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

type CreateIntentInput = {
  campaignId: string;
  provider: PaymentProvider;
  amount: number;
};

export const paymentService = {
  /* =========================
     CREATE PAYMENT INTENT
  ========================= */
  async createIntent(input: CreateIntentInput) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("payments")
      .insert({
        campaign_id: input.campaignId,
        provider: input.provider,
        amount: input.amount,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // ⚠️ In real Stripe/Chapa integration,
    // you return checkout URL here
    return {
      paymentId: data.id,
      status: data.status,
    };
  },

  /* =========================
     VERIFY PAYMENT (WEBHOOK LOGIC)
  ========================= */
  async verifyPayment(paymentId: string) {
    const supabase = await createClient();

    const { data: payment, error } = await supabase
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .single();

    if (error) throw new Error("Payment not found");

    if (payment.status === "paid") {
      return payment;
    }

    const { data, error: updateError } = await supabase
      .from("payments")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
      })
      .eq("id", paymentId)
      .select()
      .single();

    if (updateError) throw new Error(updateError.message);

    return data;
  },

  /* =========================
     GET PAYMENT
  ========================= */
  async getById(paymentId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .single();

    if (error) throw new Error(error.message);

    return data;
  },
};