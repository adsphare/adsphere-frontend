
import { createServerSupabase } from "@/lib/supabase/server";;

export const boostService = {
  async activate(listingId: string, plan: "basic" | "pro" | "premium") {
   const supabase = createServerSupabase();

    const config = {
      basic: { score: 100, multiplier: 1.2, days: 5 },
      pro: { score: 250, multiplier: 1.8, days: 10 },
      premium: { score: 600, multiplier: 2.5, days: 20 },
    }[plan];

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.days);

    const { data, error } = await supabase
      .from("boosts")
      .insert({
        listing_id: listingId,
        plan,
        score: config.score,
        multiplier: config.multiplier,
        status: "active",
        starts_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    await supabase
      .from("listings")
      .update({
        is_boosted: true,
        boost_level: config.score,
        boost_expires_at: expiresAt.toISOString(),
      })
      .eq("id", listingId);

    return data;
  },
};






