import { createClient } from "@/lib/supabase/server";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "submitted"
  | "approved"
  | "rejected"
  | "cancelled";

type CreateBookingInput = {
  campaignId: string;
  creatorId: string;
  listingId: string;
  scheduledAt?: string;
};

export const bookingService = {
  /* =========================
     CREATE BOOKING
  ========================= */
  async create(input: CreateBookingInput) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        campaign_id: input.campaignId,
        creator_id: input.creatorId,
        listing_id: input.listingId,
        status: "pending",
        scheduled_at: input.scheduledAt,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  /* =========================
     CONFIRM BOOKING
  ========================= */
  async confirm(bookingId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .eq("status", "pending")
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  /* =========================
     SUBMIT DELIVERY
  ========================= */
  async submitDelivery(
    bookingId: string,
    contentUrl: string
  ) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("bookings")
      .update({
        status: "submitted",
        content_url: contentUrl,
        submitted_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .eq("status", "in_progress")
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  /* =========================
     APPROVE DELIVERY
  ========================= */
  async approve(bookingId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("bookings")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .eq("status", "submitted")
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  /* =========================
     REJECT DELIVERY
  ========================= */
  async reject(bookingId: string, reason?: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("bookings")
      .update({
        status: "rejected",
        rejection_reason: reason,
        rejected_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .eq("status", "submitted")
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },
};