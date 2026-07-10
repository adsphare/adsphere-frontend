import { createBrowserClient } from "@supabase/ssr";

function supabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

/* =========================
   APPLY BOOST
========================= */
export async function applyBoost({
  listingId,
  durationHours,
  boostScore,
}: {
  listingId: string;
  durationHours: number;
  boostScore: number;
}) {
  const sb = supabase();

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + durationHours);

  const { error } = await sb
    .from("listings")
    .update({
      boosted: true,
      boost_score: boostScore,
      boost_expires_at: expiresAt.toISOString(),
      last_boost_at: new Date().toISOString(),
    })
    .eq("id", listingId);

  if (error) {
    console.error("applyBoost error:", error);
    throw error;
  }
}

/* =========================
   CHECK BOOST STATUS
========================= */
export function isBoostActive(listing: {
  boost_expires_at?: string | null;
}) {
  if (!listing.boost_expires_at) return false;
  return new Date(listing.boost_expires_at).getTime() > Date.now();
}

/* =========================
   AUTO EXPIRE BOOSTS (SAFE CLEANUP)
========================= */
export async function expireBoostIfNeeded(listingId: string) {
  const sb = supabase();

  const { data } = await sb
    .from("listings")
    .select("boost_expires_at")
    .eq("id", listingId)
    .single();

  if (!data?.boost_expires_at) return;

  const expired =
    new Date(data.boost_expires_at).getTime() < Date.now();

  if (expired) {
    await sb
      .from("listings")
      .update({
        boosted: false,
        boost_score: 0,
      })
      .eq("id", listingId);
  }
}






