import { createClient } from "@/lib/supabase/server";

export type EventType = "impression" | "click" | "conversion";

type TrackEventInput = {
  listingId: string;
  type: EventType;
  metadata?: Record<string, any>;
};

export const analyticsService = {
  /* =========================
     TRACK EVENT
  ========================= */
  async trackEvent(input: TrackEventInput) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("analytics_events")
      .insert({
        listing_id: input.listingId,
        event_type: input.type,
        metadata: input.metadata ?? {},
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  /* =========================
     GET LISTING STATS
  ========================= */
  async getListingStats(listingId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("analytics_events")
      .select("*")
      .eq("listing_id", listingId);

    if (error) throw new Error(error.message);

    const stats = {
      impressions: 0,
      clicks: 0,
      conversions: 0,
    };

    for (const event of data || []) {
      if (event.event_type === "impression") stats.impressions++;
      if (event.event_type === "click") stats.clicks++;
      if (event.event_type === "conversion") stats.conversions++;
    }

    return {
      listingId,
      ...stats,
    };
  },

  /* =========================
     GET CAMPAIGN PERFORMANCE
  ========================= */
  async getCampaignPerformance(listingId: string) {
    const stats = await this.getListingStats(listingId);

    const ctr =
      stats.impressions > 0
        ? stats.clicks / stats.impressions
        : 0;

    const conversionRate =
      stats.clicks > 0
        ? stats.conversions / stats.clicks
        : 0;

    return {
      ...stats,
      ctr,
      conversionRate,
    };
  },
};