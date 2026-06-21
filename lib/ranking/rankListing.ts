export function rankListing(item: any) {
  const boostMultiplier = item.is_boosted
    ? item.boost_level || 1
    : 1;

  const ctr =
    item.impressions > 0
      ? item.clicks / item.impressions
      : 0;

  const conversion =
    item.clicks > 0
      ? item.conversions / item.clicks
      : 0;

  const freshnessPenalty =
    1 /
    (1 +
      Math.log(
        Date.now() - new Date(item.created_at).getTime()
      ));

  return (
    (ctr * 50 +
      conversion * 100 +
      (item.views || 0) * 0.01) *
    boostMultiplier *
    freshnessPenalty
  );
}