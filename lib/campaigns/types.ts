export type CampaignStatus =
  | "draft"
  | "pending_payment"
  | "active"
  | "cancelled"
  | "completed";

export type Campaign = {
  id: string;
  brand_id: string;
  listing_id: string;
  title: string;
  description?: string;
  budget: number;
  status: CampaignStatus;
  created_at: string;
};






