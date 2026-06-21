import { supabase } from "@/lib/supabase";

export async function updateRank(listingId: string) {
  const { data } = await supabase
    .from("listings")
    .select("views, boost_expires_at")
    .eq("id", listingId)
    .single();

  if (!data) return;

  let rank = (data.views || 0);

  // BOOST multiplier
  if (
    data.boost_expires_at &&
    new Date(data.boost_expires_at) > new Date()
  ) {
    rank *= 5;
  }

  await supabase
    .from("listings")
    .update({ rank_score: rank })
    .eq("id", listingId);
}