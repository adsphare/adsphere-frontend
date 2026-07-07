export type Listing = {
  boost_score?: number;
  created_at?: string;
  views?: number;
  clicks?: number;
};

export function rankListing(listing: Listing): number {
  const now = Date.now();

  const createdAt = listing.created_at
    ? new Date(listing.created_at).getTime()
    : now;

  const ageHours = (now - createdAt) / (1000 * 60 * 60);

  // TIME DECAY
  const timeScore = 100 / (1 + ageHours * 0.05);

  // BOOST (capped)
  const boostScore = Math.min(listing.boost_score || 0, 1000);

  // ENGAGEMENT
  const views = listing.views || 0;
  const clicks = listing.clicks || 0;

  const engagementScore = views * 0.1 + clicks * 3;

  // FINAL
  return timeScore + boostScore * 1.2 + engagementScore;
}
