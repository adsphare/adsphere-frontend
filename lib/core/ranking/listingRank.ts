import { createServerSupabase } from "@/lib/supabase/server";

/* =========================
   LISTING TYPE
========================= */
export type Listing = {
  id: string;
  owner_id: string;
  title: string;
  location: string;
  created_at: string;
  boost_score?: number;
  views?: number;
  clicks?: number;
  rank?: number;
};

/* =========================
   CORE RANKING ENGINE
========================= */
export function rankListing(listing: Listing): number {
  const now = Date.now();

  const createdAt = new Date(listing.created_at).getTime();
  const ageHours = (now - createdAt) / (1000 * 60 * 60);

  // time decay
  const timeScore = 100 / (1 + ageHours * 0.05);

  // boost (safe cap)
  const boostScore = Math.min(listing.boost_score || 0, 1000);

  // engagement
  const engagement =
    (listing.views || 0) * 0.1 +
    (listing.clicks || 0) * 3;

  return timeScore + boostScore * 1.2 + engagement;
}

/* =========================
   SERVER: GET RANKED LISTINGS
========================= */
export async function getRankedListings(): Promise<(Listing & { rank: number })[]> {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("listings")
    .select(
      "id, owner_id, title, location, created_at, boost_score, views, clicks"
    );

  if (error) throw new Error(error.message);

  const ranked = (data || []).map((item: Listing) => ({
    ...item,
    rank: rankListing(item),
  }));

  return ranked.sort((a, b) => b.rank - a.rank);
}
