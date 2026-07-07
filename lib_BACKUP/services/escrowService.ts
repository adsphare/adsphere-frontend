import { createServerSupabase } from "@/lib/supabase/server";

export const escrowService = {
  async create(data: {
    conversationId: string;
    listingId: string;
    buyerId: string;
    sellerId: string;
    amount: number;
  }) {
    const supabase = createServerSupabase();

    const { data: escrow, error } = await supabase
      .from("escrow_orders")
      .insert({
        conversation_id: data.conversationId,
        listing_id: data.listingId,
        buyer_id: data.buyerId,
        seller_id: data.sellerId,
        amount: data.amount,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return escrow;
  },

  async fund(id: string) {
    const supabase = createServerSupabase();

    const { data, error } = await supabase
      .from("escrow_orders")
      .update({ status: "funded" })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async release(id: string) {
    const supabase = createServerSupabase();

    const { data, error } = await supabase
      .from("escrow_orders")
      .update({ status: "released" })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};





