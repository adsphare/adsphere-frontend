import { db } from "@/lib/core/db";

export const escrow = {
  /* =========================
     CREATE ESCROW TRANSACTION
  ========================= */
  async createTransaction({
    listingId,
    buyerId,
    sellerId,
    amount,
  }: {
    listingId: string;
    buyerId: string;
    sellerId: string;
    amount: number;
  }) {
    const { data, error } = await db
      .from("escrow_transactions")
      .insert({
        listing_id: listingId,
        buyer_id: buyerId,
        seller_id: sellerId,
        amount,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /* =========================
     GET TRANSACTION
  ========================= */
  async getTransaction(id: string) {
    const { data, error } = await db
      .from("escrow_transactions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /* =========================
     RELEASE FUNDS (SELLER GETS PAID)
  ========================= */
  async releaseFunds(transactionId: string) {
    const { data, error } = await db
      .from("escrow_transactions")
      .update({
        status: "released",
        released_at: new Date().toISOString(),
      })
      .eq("id", transactionId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /* =========================
     CANCEL TRANSACTION
  ========================= */
  async cancelTransaction(transactionId: string) {
    const { data, error } = await db
      .from("escrow_transactions")
      .update({
        status: "cancelled",
      })
      .eq("id", transactionId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /* =========================
     LIST USER TRANSACTIONS
  ========================= */
  async getUserTransactions(userId: string) {
    const { data, error } = await db
      .from("escrow_transactions")
      .select("*")
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },
};

