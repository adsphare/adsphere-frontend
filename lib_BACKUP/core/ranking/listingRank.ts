import { trustScore } from "@/lib/core/trust/trustScore";
import { db } from "@/lib/core/db";

type Listing = {
  id: string;
  owner_id: string;
  created_at: string;
  views?: number;
  likes?: number;
};

export const listingRank = {

  /* =========================
     CALCULATE SCORE
  ========================= */
  async calculate(listing: Listing) {
    const trust = await trustScore.get(listing.owner_id);

    const views = listing.views ?? 0;
    const likes = listing.likes ?? 0;

    const ageInHours =
      (Date.now() - new Date(listing.created_at).getTime()) /
      (1000 * 60 * 60);

    // decay over time
    const recencyBoost = Math.max(0, 100 - ageInHours);

    // engagement score
    const engagement = views * 0.2 + likes * 1.5;

    // FINAL SCORE
    const score =
      trust * 1.5 +
      engagement +
      recencyBoost * 0.3;

    return score;
  },

  /* =========================
     GET SORTED LISTINGS
  ========================= */
  async getRankedListings() {
    const { data: listings } = await db
      .from("listings")
      .select("*");

    if (!listings) return [];

    const ranked = await Promise.all(
      listings.map(async (l) => ({
        ...l,
        rank: await this.calculate(l),
      }))
    );

    return ranked.sort((a, b) => b.rank - a.rank);
  },
};

