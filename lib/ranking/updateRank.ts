import { createServerSupabase } from "@/lib/supabase/server";
import { rankListing } from "@/lib/ranking/rankListing";

export async function updateRank(listingId: string) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single();

  if (error || !data) return null;

  // 🧠 SINGLE SOURCE OF TRUTH
  const score = rankListing(data);

  const { error: updateError } = await supabase
    .from("listings")
    .update({
      rank_score: score,
    })
    .eq("id", listingId);

  if (updateError) {
    console.error("Rank update failed:", updateError.message);
    return null;
  }

  return { listingId, score };
}






