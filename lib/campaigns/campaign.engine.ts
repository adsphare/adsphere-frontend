import { campaignService } from "@/lib/campaigns/campaign.service";
import { paymentService } from "@/lib/payments/payment.service";
import { boostService } from "@/lib/boost/boost.service";
import { analyticsService } from "@/lib/analytics/analytics.service";

export const campaignEngine = {
  /* =========================
     CREATE CAMPAIGN
  ========================= */
  async createCampaign(input: {
    brandId: string;
    listingId: string;
    title: string;
    budget: number;
    description?: string;
  }) {
    return campaignService.create({
      brandId: input.brandId,
      listingId: input.listingId,
      title: input.title,
      budget: input.budget,
      description: input.description,
    });
  },

  /* =========================
     REQUEST PAYMENT
  ========================= */
  async requestPayment(input: {
    campaignId: string;
    provider: "stripe" | "chapa";
  }) {
    const campaign = await campaignService.getById(input.campaignId);

    if (!campaign) throw new Error("Campaign not found");
    if (campaign.status !== "draft") {
      throw new Error("Campaign must be in draft state");
    }

    await campaignService.setPendingPayment(input.campaignId);

    const payment = await paymentService.createIntent({
      campaignId: input.campaignId,
      provider: input.provider,
      amount: campaign.budget,
    });

    return payment;
  },

  /* =========================
     ACTIVATE CAMPAIGN
  ========================= */
  async activateCampaign(campaignId: string) {
    const campaign = await campaignService.activate(campaignId);

    if (!campaign) throw new Error("Activation failed");

    await analyticsService.trackEvent({
      listingId: campaign.listing_id,
      type: "conversion",
      metadata: { event: "campaign_activated" },
    });

    return campaign;
  },

  /* =========================
     PAYMENT CONFIRMATION
  ========================= */
  async confirmPayment(paymentId: string, campaignId: string) {
    await paymentService.verifyPayment(paymentId);

    const campaign = await this.activateCampaign(campaignId);

    await boostService.activate({
      listingId: campaign.listing_id,
      plan: "basic",
    });

    await analyticsService.trackEvent({
      listingId: campaign.listing_id,
      type: "conversion",
      metadata: { event: "campaign_started" },
    });

    return {
      success: true,
      campaign,
    };
  },

  /* =========================
     CANCEL CAMPAIGN
  ========================= */
  async cancelCampaign(campaignId: string) {
    return campaignService.cancel(campaignId);
  },
};