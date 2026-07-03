import { createServerSupabase } from "@/lib/supabase/server";

/* =========================
   AUTO RELEASE ENGINE v5
   SAFE + IDEMPOTENT
========================= */

export async function autoReleaseEngine() {
  const supabase = createServerSupabase();

  const now = new Date().toISOString();

  // 1. Get all eligible escrows
  const { data: escrows, error } = await supabase
    .from("escrow_orders")
    .select("*")
    .eq("status", "delivered") // only delivered can auto-release
    .lte("auto_release_at", now); // time reached

  if (error) {
    console.error("Auto-release fetch error:", error.message);
    return;
  }

  if (!escrows || escrows.length === 0) {
    return { processed: 0 };
  }

  let releasedCount = 0;

  // 2. Process each escrow safely
  for (const escrow of escrows) {
    try {
      // ⚠ SKIP IF DISPUTED
      if (escrow.status === "disputed") continue;

      // ⚠ SKIP IF NOT DELIVERED ANYMORE
      if (escrow.status !== "delivered") continue;

      // 3. Idempotent update (PREVENT DOUBLE PAYOUT)
      const { data, error: updateError } = await supabase
        .from("escrow_orders")
        .update({
          status: "released",
          released_at: new Date().toISOString(),
        })
        .eq("id", escrow.id)
        .eq("status", "delivered") // extra safety lock
        .select()
        .single();

      if (updateError) {
        console.error("Release failed:", escrow.id, updateError.message);
        continue;
      }

      releasedCount++;

      console.log("💰 AUTO-RELEASED:", data.id);
    } catch (err) {
      console.error("Auto-release crash:", err);
    }
  }

  return {
    processed: escrows.length,
    released: releasedCount,
  };
}




