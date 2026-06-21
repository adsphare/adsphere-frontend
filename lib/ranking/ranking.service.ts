import { rankListing } from "./rank";

export const rankingService = {
  calculateScore(listing: any) {
    return {
      score: rankListing(listing),
    };
  },
};