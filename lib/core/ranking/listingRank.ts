export function rankListing(
  listing: {
    boost_score?: number | null;
    boost_views?: number | null;
    boost_clicks?: number | null;
    created_at?: string | null;
  }
) {
  const boostScore =
    listing.boost_score ?? 0;

  const views =
    listing.boost_views ?? 0;

  const clicks =
    listing.boost_clicks ?? 0;


  const engagement =
    clicks * 5 + views;


  let freshness = 0;


  if (listing.created_at) {
    const created =
      new Date(
        listing.created_at
      ).getTime();


    const now =
      Date.now();


    const days =
      (now - created) /
      (1000 * 60 * 60 * 24);


    freshness =
      Math.max(
        0,
        100 - days
      );
  }


  return (
    boostScore * 10 +
    engagement +
    freshness
  );
}