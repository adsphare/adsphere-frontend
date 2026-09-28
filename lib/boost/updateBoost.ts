/* =========================
   LEGACY BOOST MUTATIONS DISABLED
========================= */

export async function applyBoost(): Promise<never> {
  throw new Error(
    "Legacy Boost activation is disabled. Use the canonical payment settlement flow.",
  );
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
   LEGACY AUTO-EXPIRATION DISABLED
========================= */

export async function expireBoostIfNeeded(): Promise<never> {
  throw new Error(
    "Legacy Boost expiration is disabled. Use the canonical database expiration job.",
  );
}
