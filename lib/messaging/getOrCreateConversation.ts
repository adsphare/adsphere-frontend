import { createBrowserClient } from "@supabase/ssr";

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function getOrCreateConversation({
  listingId,
  buyerId,
  sellerId,
}: {
  listingId: string;
  buyerId: string;
  sellerId: string;
}) {
  const supabase = getSupabase();

  // 1. check existing conversation
  const { data: existing, error: findError } = await supabase
    .from("conversations")
    .select("*")
    .eq("listing_id", listingId)
    .eq("buyer_id", buyerId)
    .eq("seller_id", sellerId)
    .maybeSingle();

  if (findError) {
    console.error("find conversation error:", findError);
    throw findError;
  }

  if (existing) return existing;

  // 2. create new conversation
  const { data, error } = await supabase
    .from("conversations")
    .insert([
      {
        listing_id: listingId,
        buyer_id: buyerId,
        seller_id: sellerId,
        status: "active",
        escrow_status: "pending",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("create conversation error:", error);
    throw error;
  }

  return data;
}






