import { campaignService } from "./service";

export const campaignEngine = {
  async createCampaign(input: {
    brandId: string;
    listingId: string;
    title: string;
    budget: number;
    description?: string;
    userId: string;
  }) {
    return campaignService.create(input);
  },

  async activateCampaign(campaignId: string) {
    const campaign = await campaignService.getById(campaignId);

    if (!campaign) throw new Error("Campaign not found");
    if (campaign.status !== "pending_payment") {
      throw new Error("Campaign not ready for activation");
    }

    return campaignService.updateStatus(campaignId, "active");
  },

  async cancelCampaign(campaignId: string) {
    const campaign = await campaignService.getById(campaignId);

    if (!campaign) throw new Error("Campaign not found");
    if (campaign.status === "active") {
      throw new Error("Active campaign cannot be cancelled");
    }

    return campaignService.updateStatus(campaignId, "cancelled");
  },
};





