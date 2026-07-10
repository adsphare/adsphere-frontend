import type { Listing } from "@/lib/listings/types";

/**
 * Adspheria Listing Ranking Engine (MVP v1)
 *
 * Factors:
 * - Freshness
 * - Paid Boost
 * - Engagement
 */

export function rankListing(listing: Listing): number {
  const now = Date.now();

  const created = new Date(listing.created_at).getTime();

  const ageHours = Math.max(
    0,
    (now - created) / (1000 * 60 * 60)
  );

  // Fresh listings receive a temporary boost
  const freshness = 100 / (1 + ageHours * 0.05);

  // Paid boost (0–1000)
  const boost = Math.min(
    listing.boost_score ?? 0,
    1000
  );

  // Engagement score
  const engagement =
    (listing.boost_views ?? 0) * 0.1 +
    (listing.boost_clicks ?? 0) * 3;

  const score =
    freshness +
    boost * 1.2 +
    engagement;

  return Number(score.toFixed(2));
}

export type { Listing };
