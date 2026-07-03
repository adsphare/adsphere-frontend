import { createServerSupabase } from "@/lib/supabase/server";

export type EventType = "impression" | "click" | "conversion";

type TrackEventInput = {
  listingId: string;
  type: EventType;
  metadata?: Record<string, any>;
};

export const analyticsService = {
  /* =========================
     TRACK EVENT (FAST + SAFE)
  ========================= */
  async trackEvent(input: TrackEventInput) {
    const supabase = createServerSupabase();

    const { error } = await supabase.from("analytics_events").insert({
      listing_id: input.listingId,
      event_type: input.type,
      metadata: input.metadata ?? {},
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Analytics insert error:", error.message);
      throw new Error(error.message);
    }

    return { success: true };
  },

  /* =========================
     GET LISTING STATS
  ========================= */
  async getListingStats(listingId: string) {
    const supabase = createServerSupabase();

    const { data, error } = await supabase
      .from("analytics_events")
      .select("event_type")
      .eq("listing_id", listingId);

    if (error) throw new Error(error.message);

    const stats = {
      impressions: 0,
      clicks: 0,
      conversions: 0,
    };

    for (const event of data || []) {
      if (event.event_type === "impression") stats.impressions++;
      else if (event.event_type === "click") stats.clicks++;
      else if (event.event_type === "conversion") stats.conversions++;
    }

    return {
      listingId,
      ...stats,
    };
  },

  /* =========================
     PERFORMANCE METRICS
  ========================= */
  async getCampaignPerformance(listingId: string) {
    const stats = await this.getListingStats(listingId);

    const ctr =
      stats.impressions > 0 ? stats.clicks / stats.impressions : 0;

    const conversionRate =
      stats.clicks > 0 ? stats.conversions / stats.clicks : 0;

    return {
      ...stats,
      ctr,
      conversionRate,
    };
  },
};





