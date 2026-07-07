import { createBrowserSupabase } from "@/lib/supabase/browser";

type BoostPlan = "basic" | "pro" | "premium";

const BOOST_CONFIG: Record<
  BoostPlan,
  { days: number; score: number }
> = {
  basic: {
    days: 3,
    score: 10,
  },
  pro: {
    days: 7,
    score: 25,
  },
  premium: {
    days: 14,
    score: 50,
  },
};

export async function activateBoost(
  listingId: string,
  plan: BoostPlan = "basic"
) {
  const supabase = createBrowserSupabase();

  try {
    const config = BOOST_CONFIG[plan];

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.days);

    const { data, error } = await supabase
      .from("listings")
      .update({
        boosted: true,
        boost_plan: plan,
        boost_score: config.score,
        boost_expires_at: expiresAt.toISOString(),
        last_boost_at: new Date().toISOString(),
      })
      .eq("id", listingId)
      .select()
      .single();

    if (error) {
      console.error("activateBoost error:", error.message);
      return { success: false, error };
    }

    return {
      success: true,
      data,
    };
  } catch (err: any) {
    console.error("activateBoost crash:", err.message);
    return {
      success: false,
      error: err.message,
    };
  }
}

