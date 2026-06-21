import { eventBus } from "../eventBus";
import { notificationService } from "@/lib/notifications/notification.service";
import { analyticsService } from "@/lib/analytics/analytics.service";

export function registerCampaignCreated() {
  eventBus.on("CampaignCreated", async (payload) => {
    const { campaignId, brandId, listingId } = payload;

    /* =========================
       1. NOTIFY BRAND
    ========================= */
    await notificationService.create({
      userId: brandId,
      type: "campaign_created",
      title: "Campaign Created",
      message: "Your campaign has been successfully created",
    });

    /* =========================
       2. START ANALYTICS
    ========================= */
    await analyticsService.trackEvent({
      listingId,
      type: "impression",
      metadata: { event: "campaign_created" },
    });
  });
}