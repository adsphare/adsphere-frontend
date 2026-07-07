import type { Listing } from "./types";

export function rankListing(listing: Listing): number {
  const now = Date.now();
  const createdAt = new Date(listing.created_at).getTime();

  const ageHours = (now - createdAt) / (1000 * 60 * 60);

  const timeScore = 100 / (1 + ageHours * 0.05);
  const boostScore = Math.min(listing.boost_score || 0, 1000);

  const views = listing.views || 0;
  const clicks = listing.clicks || 0;

  const engagement = views * 0.1 + clicks * 3;

  return timeScore + boostScore * 1.2 + engagement;
}
