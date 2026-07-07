import { marketplace } from "@/lib/core/marketplace";
import { db } from "@/lib/core/db";

export const listingService = {
  getAll() {
    return marketplace.getActiveListings();
  },

  getById(id: string) {
    return marketplace.getListingById(id);
  },

  create(payload: any) {
    return marketplace.createListing(payload);
  },

  trackView(listingId: string, userId?: string) {
    return marketplace.trackView(listingId, userId);
  },

  async getUser() {
    const { data } = await db.auth.getUser();
    return data?.user || null;
  },
};

