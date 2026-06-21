import { supabase } from "@/lib/supabase";

export async function updateRank(listingId: string) {
  const { data, error } = await supabase
    .from("listings")
    .select("boost_score, views, created_at")
    .eq("id", listingId)
    .single();

  if (error || !data) return;

  const boost = data.boost_score || 0;
  const views = data.views || 0;

  let freshness = 0;

  if (data.created_at) {
    const ageHours =
      (Date.now() - new Date(data.created_at).getTime()) /
      (1000 * 60 * 60);

    freshness = Math.max(0, 100 - ageHours);
  }

  const rank_score =
    boost * 5 +
    views * 0.5 +
    freshness * 0.3;

  await supabase
    .from("listings")
    .update({ rank_score })
    .eq("id", listingId);
}