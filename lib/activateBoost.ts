import { supabase } from "@/lib/supabase";

export async function activateBoost({
  listingId,
  plan,
  provider,
}: {
  listingId: string;
  plan: "basic" | "premium" | "pro";
  provider: "stripe";
}) {
  const now = new Date();

  const boostDays = plan === "premium" ? 7 : 3;

  const expiresAt = new Date(
    now.getTime() + boostDays * 24 * 60 * 60 * 1000
  );

  const boostScore =
    plan === "premium" ? 50 : plan === "pro" ? 35 : 20;

  const { error } = await supabase
    .from("listings")
    .update({
      boost_score: boostScore,
      boost_expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", listingId);

  if (error) {
    console.error("Boost activation error:", error);
    throw error;
  }

  // optional: log boost payment
  await supabase.from("payments").insert({
    listing_id: listingId,
    amount: boostScore,
    status: "paid",
    provider,
    created_at: new Date().toISOString(),
  });

  return { success: true };
}