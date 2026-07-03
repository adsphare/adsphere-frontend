import { createServerSupabase } from "@/lib/supabase/server";

export type AnalyticsEventType =
  | "impression"
  | "click"
  | "conversion"
  | "view"
  | "boost_impression";

export interface TrackEventInput {
  listingId: string;
  eventType: AnalyticsEventType;
  userId?: string;
  metadata?: Record<string, any>;
}

export const analyticsService = {
  /**
   * Track any ad/boost/listing event
   */
  async trackEvent(input: TrackEventInput) {
    const supabase = createServerSupabase();

    const { listingId, eventType, userId, metadata } = input;

    const { error } = await supabase.from("ad_events").insert({
      listing_id: listingId,
      event_type: eventType,
      user_id: userId ?? null,
      metadata: metadata ?? {},
      created_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(`Analytics event failed: ${error.message}`);
    }

    return { success: true };
  },

  /**
   * Get analytics summary for a listing
   */
  async getListingStats(listingId: string) {
    const supabase = createServerSupabase();

    const { data, error } = await supabase
      .from("ad_events")
      .select("event_type")
      .eq("listing_id", listingId);

    if (error) {
      throw new Error(error.message);
    }

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

    return stats;
  },
};





