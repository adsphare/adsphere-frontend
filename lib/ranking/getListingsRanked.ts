import { createClient } from "@/lib/supabase/server";

export async function getListingsRanked() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      boosts (
        id,
        status,
        plan,
        expires_at
      )
    `);

  if (error) {
    throw new Error(error.message);
  }

  const now = new Date();

  const ranked = (data || [])
    .map((listing) => {
      let score = 0;

      const boost = listing.boosts?.[0];

      // 🚀 BOOST PRIORITY
      if (boost?.status === "active") {
        score += boost.plan === "premium" ? 100 : 50;
      }

      // ⏳ RECENCY BONUS
      const created = new Date(listing.created_at);
      const daysOld =
        (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);

      score += Math.max(0, 30 - daysOld);

      return { ...listing, score };
    })
    .sort((a, b) => b.score - a.score);

  return ranked;
}