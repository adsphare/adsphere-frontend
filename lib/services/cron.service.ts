import { createServerSupabase } from "@/lib/supabase/server";

export const cronService = {
  async expireBoosts() {
    const supabase = createServerSupabase();

    const now = new Date().toISOString();

    await supabase
      .from("boosts")
      .update({ status: "expired" })
      .lt("expires_at", now)
      .eq("status", "active");

    await supabase
      .from("listings")
      .update({
        is_boosted: false,
        boost_level: 0,
      })
      .lt("boost_expires_at", now);

    return { success: true };
  },
};





