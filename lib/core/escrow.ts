import { db } from "@/lib/core/db";

/* =========================
   TYPES
========================= */

export type EscrowStatus =
  | "pending"
  | "locked"
  | "released"
  | "cancelled";

export type EscrowTransaction = {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  status: EscrowStatus;
  created_at: string;
  locked_at?: string;
  released_at?: string;
  cancelled_at?: string;
};

/* =========================
   ESCROW ENGINE
========================= */

export const escrow = {
  /* =========================
     CREATE TRANSACTION
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
    return data as EscrowTransaction;
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
    return data as EscrowTransaction;
  },

  /* =========================
     LOCK TRANSACTION
  ========================= */
  async lockTransaction(id: string) {
    const tx = await this.getTransaction(id);

    if (tx.status !== "pending") {
      throw new Error("Only pending transactions can be locked");
    }

    const { data, error } = await db
      .from("escrow_transactions")
      .update({
        status: "locked",
        locked_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as EscrowTransaction;
  },

  /* =========================
     RELEASE FUNDS
  ========================= */
  async releaseFunds(id: string) {
    const tx = await this.getTransaction(id);

    if (tx.status !== "locked") {
      throw new Error("Only locked transactions can be released");
    }

    const { data, error } = await db
      .from("escrow_transactions")
      .update({
        status: "released",
        released_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as EscrowTransaction;
  },

  /* =========================
     CANCEL TRANSACTION
  ========================= */
  async cancelTransaction(id: string) {
    const tx = await this.getTransaction(id);

    if (tx.status === "released") {
      throw new Error("Cannot cancel released transaction");
    }

    const { data, error } = await db
      .from("escrow_transactions")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as EscrowTransaction;
  },

  /* =========================
     USER TRANSACTIONS
  ========================= */
  async getUserTransactions(userId: string) {
    const { data, error } = await db
      .from("escrow_transactions")
      .select("*")
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []) as EscrowTransaction[];
  },
};