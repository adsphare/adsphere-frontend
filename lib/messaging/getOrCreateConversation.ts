import { supabase } from "@/lib/supabase";

export async function getOrCreateConversation({
  listingId,
  buyerId,
  ownerId,
}: {
  listingId: string;
  buyerId: string;
  ownerId: string;
}) {
  if (!listingId || !buyerId || !ownerId) {
    throw new Error("Missing conversation parameters");
  }

  // STEP 1: check existing conversation
  const { data: existing, error: findError } = await supabase
    .from("conversations")
    .select("*")
    .eq("listing_id", listingId)
    .eq("buyer_id", buyerId)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (findError) {
    console.error("Find conversation error:", findError);
    throw findError;
  }

  if (existing) return existing;

  // STEP 2: create conversation safely
  const { data, error: insertError } = await supabase
    .from("conversations")
    .insert({
      listing_id: listingId,
      buyer_id: buyerId,
      owner_id: ownerId,

      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_message_at: new Date().toISOString(),

      last_message: "",

      // SaaS defaults (IMPORTANT)
      unread_buyer: 0,
      unread_owner: 0,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Create conversation error:", insertError);

    // 🔥 EXTRA SAFETY: handle race condition (duplicate insert)
    const { data: retry } = await supabase
      .from("conversations")
      .select("*")
      .eq("listing_id", listingId)
      .eq("buyer_id", buyerId)
      .eq("owner_id", ownerId)
      .maybeSingle();

    if (retry) return retry;

    throw insertError;
  }

  return data;
}