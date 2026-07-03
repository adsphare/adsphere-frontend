export type Listing = {
  boost_score?: number;
  created_at?: string;
  views?: number;
  clicks?: number;
};

export function rankListing(listing: Listing) {
  const now = Date.now();

  const createdAt = listing.created_at
    ? new Date(listing.created_at).getTime()
    : now;

  const ageHours = (now - createdAt) / (1000 * 60 * 60);

  // 🧠 1. TIME DECAY (bounded curve instead of linear drop)
  const timeScore = 100 / (1 + ageHours * 0.05);

  // 🚀 2. BOOST SCORE (capped to prevent abuse)
  const boostScore = Math.min(listing.boost_score || 0, 1000);

  // 👁 3. ENGAGEMENT SIGNALS
  const views = listing.views || 0;
  const clicks = listing.clicks || 0;

  // clicks matter more than views (intent > exposure)
  const engagementScore = views * 0.1 + clicks * 3;

  // 🧮 FINAL SCORE
  const finalScore =
    timeScore +
    boostScore * 1.2 +
    engagementScore;

  return finalScore;
}





