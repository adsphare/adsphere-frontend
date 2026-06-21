import { createClient } from "@/lib/supabase/server";
import { rankingService } from "@/lib/ranking/ranking.service";
import { analyticsService } from "@/lib/analytics/analytics.service";

export type MarketplaceFilter = {
  category?: string;
  location?: string;
  minBudget?: number;
  maxBudget?: number;
};

export const marketplaceService = {
  /* =========================
     GET MARKETPLACE FEED
  ========================= */
  async getFeed(filter?: MarketplaceFilter) {
    const supabase = await createClient();

    /* -------------------------
       1. FETCH LISTINGS
    ------------------------- */
    let query = supabase
      .from("listings")
      .select(`
        *,
        boosts (
          score,
          multiplier,
          status,
          expires_at
        )
      `);

    if (filter?.category) {
      query = query.eq("category", filter.category);
    }

    if (filter?.location) {
      query = query.eq("location", filter.location);
    }

    if (filter?.minBudget !== undefined) {
      query = query.gte("price", filter.minBudget);
    }

    if (filter?.maxBudget !== undefined) {
      query = query.lte("price", filter.maxBudget);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    /* -------------------------
       2. RANK + ANALYTICS
    ------------------------- */
    const ranked = await Promise.all(
      (data || []).map(async (listing) => {
        const [rankingResult, stats] = await Promise.all([
          rankingService.calculateScore({
            listingId: listing.id,
            listing,
          }),
          analyticsService.getListingStats(listing.id),
        ]);

        return {
          ...listing,
          rank_score: rankingResult.score,
          analytics: stats,
        };
      })
    );

    /* -------------------------
       3. SORT FEED
    ------------------------- */
    return ranked.sort((a, b) => b.rank_score - a.rank_score);
  },

  /* =========================
     GET SINGLE LISTING
  ========================= */
  async getListing(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("listings")
      .select(`
        *,
        boosts (*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const stats = await analyticsService.getListingStats(id);

    return {
      ...data,
      analytics: stats,
    };
  },
};