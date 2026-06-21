import { createClient } from "@/lib/supabase/server";

/* =========================
   TYPES
========================= */
export type CampaignStatus =
  | "draft"
  | "pending_payment"
  | "active"
  | "cancelled"
  | "completed";

export type CreateCampaignData = {
  brandId: string;
  listingId: string;
  title: string;
  description?: string;
  budget: number;
};

/* =========================
   DOMAIN SERVICE
========================= */
export const campaignService = {
  /* =========================
     CREATE
  ========================= */
  async create(data: CreateCampaignData) {
    const supabase = await createClient();

    const { data: campaign, error } = await supabase
      .from("campaigns")
      .insert({
        brand_id: data.brandId,
        listing_id: data.listingId,
        title: data.title,
        description: data.description,
        budget: data.budget,
        status: "draft",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return campaign;
  },

  /* =========================
     GET BY ID
  ========================= */
  async getById(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  /* =========================
     SET PENDING PAYMENT
  ========================= */
  async setPendingPayment(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("campaigns")
      .update({
        status: "pending_payment",
      })
      .eq("id", id)
      .eq("status", "draft")
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  /* =========================
     ACTIVATE
  ========================= */
  async activate(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("campaigns")
      .update({
        status: "active",
        activated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("status", "pending_payment")
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  /* =========================
     CANCEL
  ========================= */
  async cancel(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("campaigns")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("status", "draft")
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  /* =========================
     UPDATE STATUS (FIXED)
  ========================= */
  async updateStatus(id: string, status: CampaignStatus) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("campaigns")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },
};