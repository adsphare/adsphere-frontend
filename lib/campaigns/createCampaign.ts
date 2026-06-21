import { eventBus } from "@/lib/events/eventBus";
import { campaignService } from "@/lib/campaigns/campaign.service";

export async function createCampaign(input: any) {
  const campaign = await campaignService.create(input);

  /* =========================
     EMIT EVENT
  ========================= */
  eventBus.emit("CampaignCreated", {
    campaignId: campaign.id,
    brandId: campaign.brand_id,
    listingId: campaign.listing_id,
    budget: campaign.budget,
  });

  return {
    success: true,
    campaign,
  };
}