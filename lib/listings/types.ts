export type ListingType =
  | "billboard"
  | "creator"
  | "digital"
  | "other";


export type Listing = {
  id: string;

  user_id: string;

  title: string;

  description: string | null;

  location: string;

  type: ListingType;

  price: number;

  currency: string;

  media: string[] | null;

  dimensions: string | null;

  status: string;

  created_at: string;

  boost_views: number;

  boost_clicks: number;

  last_boost_at: string | null;

  rank_score: number | null;

  rank_updated_at: string | null;

  rank_breakdown: Record<string, unknown> | null;

  boost_plan: string | null;

  boost_provider: string | null;

  boost_score: number;

  boost_expires_at: string | null;

  boosted: boolean;
};

