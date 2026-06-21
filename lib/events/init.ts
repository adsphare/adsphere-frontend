import { registerCampaignCreated } from "./subscribers/campaignCreated";

export function initEvents() {
  registerCampaignCreated();
}