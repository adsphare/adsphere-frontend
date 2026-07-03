import { createServerSupabase } from "@/lib/supabase/server";
import { calculateRank } from "@/lib/ranking/rank";
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
    const supabase = createServerSupabase();

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

    const listings = data ?? [];

    const ranked = await Promise.all(
      listings.map(async (listing: any) => {
        const [rankingResult, stats] = await Promise.all([
          calculateRank({
            listingId: listing.id,
            listing,
          }),
          analyticsService.getListingStats(listing.id),
        ]);

        return {
          ...listing,
          rank_score: rankingResult ?? 0,
          analytics: stats,
        };
      })
    );

    return ranked.sort(
      (a, b) => (b.rank_score ?? 0) - (a.rank_score ?? 0)
    );
  },

  /* =========================
     GET SINGLE LISTING
  ========================= */
  async getListing(id: string) {
    const supabase = createServerSupabase();

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





