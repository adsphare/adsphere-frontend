import { createClient } from "@/lib/supabase/server";

export type BoostPlan = "basic" | "pro" | "premium";

type ActivateBoostInput = {
  listingId: string;
  plan: BoostPlan;
};

const BOOST_CONFIG = {
  basic: { durationDays: 5, score: 500, multiplier: 1.2 },
  pro: { durationDays: 7, score: 1200, multiplier: 1.8 },
  premium: { durationDays: 10, score: 2500, multiplier: 3 },
};

export const boostService = {
  /* =========================
     ACTIVATE BOOST
  ========================= */
  async activate(input: ActivateBoostInput) {
    const supabase = await createClient();

    const config = BOOST_CONFIG[input.plan];

    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + config.durationDays * 24 * 60 * 60 * 1000
    );

    // 1. CREATE BOOST RECORD
    const { error: boostError } = await supabase.from("boosts").insert({
      listing_id: input.listingId,
      plan: input.plan,
      status: "active",
      score: config.score,
      multiplier: config.multiplier,
      starts_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    });

    if (boostError) {
      throw new Error(boostError.message);
    }

    // 2. UPDATE LISTING
    const { error: listingError } = await supabase
      .from("listings")
      .update({
        is_boosted: true,
        boost_level:
          input.plan === "basic" ? 1 : input.plan === "pro" ? 2 : 3,
        boost_score: config.score,
        boost_expires_at: expiresAt.toISOString(),
      })
      .eq("id", input.listingId);

    if (listingError) {
      throw new Error(listingError.message);
    }

    // 3. INIT ANALYTICS ROW
    await supabase.from("boost_analytics").insert({
      listing_id: input.listingId,
      plan: input.plan,
      impressions: 0,
      clicks: 0,
      views_generated: 0,
      conversion_rate: 0,
    });

    return {
      success: true,
      listingId: input.listingId,
      plan: input.plan,
      expiresAt,
    };
  },
};