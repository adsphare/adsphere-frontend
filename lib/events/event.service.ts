import { createClient } from "@/lib/supabase/server";

export type TrackEventInput = {
  listingId: string;
  userId?: string;
  type: "view" | "click" | "conversion";
};

export const eventService = {
  async trackEvent(input: TrackEventInput) {
    const supabase = await createClient();

    const now = new Date().toISOString();

    /* =========================
       1. INSERT EVENT LOG
    ========================= */
    await supabase.from("events").insert({
      listing_id: input.listingId,
      user_id: input.userId || null,
      type: input.type,
      created_at: now,
    });

    /* =========================
       2. UPDATE LISTING METRICS
    ========================= */
    const { data: listing } = await supabase
      .from("listings")
      .select("views, clicks, conversions")
      .eq("id", input.listingId)
      .single();

    if (!listing) return;

    const update: any = {};

    if (input.type === "view") {
      update.views = (listing.views || 0) + 1;
      update.last_viewed_at = now;
    }

    if (input.type === "click") {
      update.clicks = (listing.clicks || 0) + 1;
      update.last_clicked_at = now;
    }

    if (input.type === "conversion") {
      update.conversions = (listing.conversions || 0) + 1;
    }

    await supabase
      .from("listings")
      .update(update)
      .eq("id", input.listingId);
  },
};