import { createServerSupabase } from "@/lib/supabase/server";

export const conversationService = {
  async getOrCreate({
    listingId,
    buyerId,
    sellerId,
  }: {
    listingId: string;
    buyerId: string;
    sellerId: string;
  }) {
    const supabase = createServerSupabase();

    const { data: existing } = await supabase
      .from("conversations")
      .select("*")
      .eq("listing_id", listingId)
      .eq("buyer_id", buyerId)
      .eq("seller_id", sellerId)
      .maybeSingle();

    if (existing) return existing;

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        listing_id: listingId,
        buyer_id: buyerId,
        seller_id: sellerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },
};






