import { supabase } from "@/lib/supabase";

export async function activateBoost({
  listingId,
  plan,
}: {
  listingId: string;
  plan: "basic" | "pro" | "premium";
}) {
  const boostScore =
    plan === "premium" ? 50 :
    plan === "pro" ? 30 :
    10;

  const boostDurationDays =
    plan === "premium" ? 7 :
    plan === "pro" ? 5 :
    3;

  const expiresAt = new Date(
    Date.now() + boostDurationDays * 24 * 60 * 60 * 1000
  ).toISOString();

  const { error } = await supabase
    .from("listings")
    .update({
      boost_score: boostScore,
      boost_expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", listingId);

  if (error) {
    console.error("Boost activation failed:", error.message);
    throw error;
  }

  return true;
}