import { supabaseAdmin } from "@/lib/supabase/admin";

export const cronService = {
  async expireBoosts() {
    const supabase = supabaseAdmin;

    const { data, error } = await supabase.rpc(
      "expire_expired_boosts",
    );

    if (error) {
      throw new Error(
        `Boost expiration failed: ${error.message}`,
      );
    }

    return {
      processed: Number(data?.processed ?? 0),
      expired: Number(data?.expired ?? 0),
    };
  },

  async autoReleaseEscrows() {
    throw new Error(
      "Legacy escrow auto-release is disabled. Use the canonical authorized settlement flow.",
    );
  },
};

