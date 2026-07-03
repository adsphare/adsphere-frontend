import { createBrowserSupabase } from "@/lib/supabase/browser";

export async function getOrCreateConversation({
  listingId,
  buyerId,
  sellerId,
}: {
  listingId: string;
  buyerId: string;
  sellerId: string;
}) {
  const supabase = createBrowserSupabase();

  // 1. check existing conversation
  const { data: existing, error: findError } = await supabase
    .from("conversations")
    .select("*")
    .eq("listing_id", listingId)
    .eq("buyer_id", buyerId)
    .eq("seller_id", sellerId)
    .maybeSingle();

  if (findError) {
    console.error("Conversation fetch error:", findError.message);
  }

  if (existing) return existing;

  // 2. create new conversation
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      listing_id: listingId,
      buyer_id: buyerId,
      seller_id: sellerId,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}