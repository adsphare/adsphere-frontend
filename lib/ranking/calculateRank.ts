export function calculateRank(listing: any) {
  const boost = listing.boost_score || 0;
  const views = listing.views || 0;

  let boostMultiplier = 1;

  // if boosted and not expired → strong push
  if (listing.boost_expires_at) {
    const isActive =
      new Date(listing.boost_expires_at).getTime() > Date.now();

    if (isActive) {
      boostMultiplier = 5;
    }
  }

  const ageHours =
    (Date.now() - new Date(listing.created_at).getTime()) /
    (1000 * 60 * 60);

  const freshness = Math.max(0, 100 - ageHours);

  return (
    boost * 5 * boostMultiplier +
    views * 0.5 +
    freshness * 0.3
  );
}