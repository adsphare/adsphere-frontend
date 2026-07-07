import { db } from "@/lib/core/db";
import { escrow } from "@/lib/core/escrow";

/* =========================
   TYPES
========================= */

export type PaymentProvider = "stripe" | "chapa";

export type PaymentStatus =
  | "pending"
  | "succeeded"
  | "failed";

/* =========================
   CONFIG
========================= */

const PLATFORM_FEE_RATE = 0.1; // 10% Adsphare commission

/* =========================
   PAYMENT ENGINE
========================= */

export const payments = {
  /* =========================
     CREATE PAYMENT INTENT (MVP)
  ========================= */
  async createPayment({
    escrowId,
    provider,
    amount,
  }: {
    escrowId: string;
    provider: PaymentProvider;
    amount: number;
  }) {
    const fee = amount * PLATFORM_FEE_RATE;
    const sellerAmount = amount - fee;

    const { data, error } = await db
      .from("payments")
      .insert({
        escrow_id: escrowId,
        provider,
        amount,
        platform_fee: fee,
        seller_amount: sellerAmount,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  /* =========================
     CONFIRM PAYMENT SUCCESS
  ========================= */
  async confirmPayment(paymentId: string) {
    const { data: payment, error } = await db
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .single();

    if (error || !payment) {
      throw new Error("Payment not found");
    }

    // mark payment succeeded
    const { data, error: updateError } = await db
      .from("payments")
      .update({
        status: "succeeded",
        paid_at: new Date().toISOString(),
      })
      .eq("id", paymentId)
      .select()
      .single();

    if (updateError) throw new Error(updateError.message);

    // AUTO RELEASE ESCROW
    await escrow.releaseFunds(payment.escrow_id);

    return data;
  },

  /* =========================
     FAIL PAYMENT
  ========================= */
  async failPayment(paymentId: string) {
    const { data, error } = await db
      .from("payments")
      .update({
        status: "failed",
      })
      .eq("id", paymentId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /* =========================
     GET PAYMENT
  ========================= */
  async getPayment(paymentId: string) {
    const { data, error } = await db
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /* =========================
     ESCROW PAYMENT FLOW
  ========================= */
  async payForEscrow({
    listingId,
    buyerId,
    sellerId,
    amount,
    provider,
  }: {
    listingId: string;
    buyerId: string;
    sellerId: string;
    amount: number;
    provider: PaymentProvider;
  }) {
    // 1. Create escrow
    const escrowTx = await escrow.createTransaction({
      listingId,
      buyerId,
      sellerId,
      amount,
    });

    // 2. Lock escrow
    await escrow.lockTransaction(escrowTx.id);

    // 3. Create payment
    const payment = await this.createPayment({
      escrowId: escrowTx.id,
      provider,
      amount,
    });

    return {
      escrow: escrowTx,
      payment,
    };
  },
};