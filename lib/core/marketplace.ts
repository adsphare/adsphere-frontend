import { db } from "@/lib/core/db";

export const marketplace = {
  /* =========================
     GET ALL ACTIVE LISTINGS
  ========================= */
  async getActiveListings() {
    const { data, error } = await db
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  /* =========================
     GET SINGLE LISTING
  ========================= */
  async getListingById(id: string) {
    const { data, error } = await db
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /* =========================
     CREATE LISTING
  ========================= */
  async createListing(payload: any) {
    const { data, error } = await db
      .from("listings")
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /* =========================
     TRACK VIEW (IMPORTANT FOR ADSPHERA)
  ========================= */
  async trackView(listingId: string, userId?: string) {
    await db.from("analytics_events").insert({
      listing_id: listingId,
      user_id: userId || null,
      event_type: "view",
      created_at: new Date().toISOString(),
    });
  },
};