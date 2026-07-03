import { createServerSupabase } from "@/lib/supabase/server";

export async function getOrCreateConversation({
  listingId,
  buyerId,
  sellerId,
}: {
  listingId: string;
  buyerId: string;
  sellerId: string;
}) {
  const supabase = await createServerSupabase();

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
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function getMessages(conversationId: string) {
  const supabase = await createServerSupabase();

  return supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
}
