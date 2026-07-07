export type Listing = {
  id: string;
  owner_id: string;
  created_at: string;
  title: string;
  location: string;
  boost_score?: number;
  views?: number;
  clicks?: number;
};
