import { createServerSupabase } from "@/lib/supabase/server";

export const conversationService = {
  async getOrCreate(_params: {
    listingId: string;
    buyerId: string;
    sellerId: string;
  }) {
    throw new Error(
      "LEGACY_CONVERSATION_SERVICE_DISABLED: use /api/conversations/create"
    );
  },
};
