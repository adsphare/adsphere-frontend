export function calculateRank(listing: any) {
  const boost = listing.boost_score || 0;
  const views = listing.views || 0;

  const boostMultiplier =
    listing.boost_expires_at &&
    new Date(listing.boost_expires_at).getTime() > Date.now()
      ? 5
      : 1;

  const ageHours =
    (Date.now() - new Date(listing.created_at).getTime()) /
    (1000 * 60 * 60);

  const freshness = Math.max(0, 100 - ageHours);

  return boost * 5 * boostMultiplier + views * 0.5 + freshness * 0.3;
}





