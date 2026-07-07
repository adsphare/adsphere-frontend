type Listing = {
  boost_score?: number;
  views?: number;
  created_at: string;
  boost_expires_at?: string | null;
};

export function calculateRank(listing: Listing): number {
  const boost = listing.boost_score ?? 0;
  const views = listing.views ?? 0;

  const boostActive =
    listing.boost_expires_at &&
    new Date(listing.boost_expires_at).getTime() > Date.now();

  const boostMultiplier = boostActive ? 5 : 1;

  const createdAt = new Date(listing.created_at).getTime();
  const ageHours = (Date.now() - createdAt) / (1000 * 60 * 60);

  const freshness = Math.max(0, 100 - ageHours);

  return boost * 5 * boostMultiplier + views * 0.5 + freshness * 0.3;
}
