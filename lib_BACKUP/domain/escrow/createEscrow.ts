import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createEscrow({
  listingId,
  conversationId,
  buyerId,
  sellerId,
  amount,
  currency = "USD",
}: {
  listingId: string;
  conversationId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("escrow_orders")
    .insert({
      listing_id: listingId,
      conversation_id: conversationId,
      buyer_id: buyerId,
      seller_id: sellerId,
      amount,
      currency,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}





