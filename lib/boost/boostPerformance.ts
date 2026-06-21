import { createClient } from "@/lib/supabase/server";

type BoostPlan = "basic" | "pro" | "premium";

type ActivateBoostParams = {
  listingId: string;
  plan: BoostPlan;
  provider: "stripe" | "chapa";
};

const BOOST_PLANS = {
  basic: {
    score: 100,
    level: 1,
    duration: 7, // days
  },
  pro: {
    score: 200,
    level: 2,
    duration: 14,
  },
  premium: {
    score: 300,
    level: 3,
    duration: 30,
  },
};

export async function activateBoost({
  listingId,
  plan,
  provider,
}: ActivateBoostParams) {
  const supabase = await createClient();

  const boost = BOOST_PLANS[plan];

  const now = new Date();

  const expires = new Date(now);
  expires.setDate(expires.getDate() + boost.duration);

  // Update listing
  const { error: listingError } = await supabase
    .from("listings")
    .update({
      is_boosted: true,
      boost_level: boost.level,
      boost_score: boost.score,
      boost_expires_at: expires.toISOString(),
    })
    .eq("id", listingId);

  if (listingError) throw listingError;

  // Save boost record
  const { error: boostError } = await supabase
    .from("boosts")
    .insert({
      listing_id: listingId,
      provider,
      plan,
      status: "active",
      starts_at: now.toISOString(),
      expires_at: expires.toISOString(),
    });

  if (boostError) throw boostError;

  // Create analytics row
  await supabase.from("boost_analytics").insert({
    listing_id: listingId,
    plan,
    impressions: 0,
    clicks: 0,
    views_generated: 0,
    conversions: 0,
  });

  return {
    success: true,
    expires_at: expires.toISOString(),
  };
}