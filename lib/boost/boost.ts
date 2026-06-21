import { createClient } from "@/lib/supabase/server";

export type BoostPlan = "basic" | "pro" | "premium";

type BoostConfig = {
  score: number;
  multiplier: number;
  durationDays: number;
};

const BOOST_PLANS: Record<BoostPlan, BoostConfig> = {
  basic: {
    score: 100,
    multiplier: 1.2,
    durationDays: 5,
  },
  pro: {
    score: 250,
    multiplier: 1.8,
    durationDays: 10,
  },
  premium: {
    score: 600,
    multiplier: 2.5,
    durationDays: 20,
  },
};

/* =========================
   BOOST DOMAIN SERVICE
========================= */
export const boostService = {
  /* -------------------------
     ACTIVATE BOOST
  ------------------------- */
  async activate(input: {
    listingId: string;
    plan: BoostPlan;
  }) {
    const supabase = await createClient();
    const config = BOOST_PLANS[input.plan];

    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + config.durationDays * 24 * 60 * 60 * 1000
    );

    // 1. Create boost record
    const { data, error } = await supabase
      .from("boosts")
      .insert({
        listing_id: input.listingId,
        plan: input.plan,
        score: config.score,
        multiplier: config.multiplier,
        status: "active",
        starts_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // 2. Update listing boost state
    await supabase
      .from("listings")
      .update({
        is_boosted: true,
        boost_level: config.score,
        boost_expires_at: expiresAt.toISOString(),
      })
      .eq("id", input.listingId);

    return {
      success: true,
      boostId: data.id,
      expiresAt,
    };
  },

  /* -------------------------
     EXPIRE BOOSTS (CRON JOB)
  ------------------------- */
  async expire() {
    const supabase = await createClient();

    const now = new Date().toISOString();

    const { error } = await supabase
      .from("boosts")
      .update({ status: "expired" })
      .lt("expires_at", now)
      .eq("status", "active");

    if (error) throw new Error(error.message);

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