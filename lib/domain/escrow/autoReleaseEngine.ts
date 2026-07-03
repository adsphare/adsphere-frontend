import { createServerSupabase } from "@/lib/supabase/server";

/* =========================
   AUTO RELEASE ENGINE v5
   SAFE + IDPOTENT + DISPUTE SAFE
========================= */

export async function autoReleaseEngine() {
  const supabase = createServerSupabase();

  const now = new Date().toISOString();

  // 1. Get ONLY eligible escrows
  const { data: escrows, error } = await supabase
    .from("escrow_orders")
    .select("*")
    .eq("status", "delivered")
    .lte("auto_release_at", now);

  if (error) {
    console.error("Auto release fetch error:", error.message);
    return { processed: 0, released: 0 };
  }

  if (!escrows || escrows.length === 0) {
    return {
      processed: 0,
      released: 0,
    };
  }

  let released = 0;

  // 2. Process each escrow safely
  for (const escrow of escrows) {
    try {
      // 🚫 BLOCK DISPUTES
      if (escrow.status === "disputed") continue;

      // 🚫 DOUBLE CHECK (extra safety layer)
      const { data: fresh } = await supabase
        .from("escrow_orders")
        .select("status")
        .eq("id", escrow.id)
        .single();

      if (!fresh) continue;

      if (fresh.status !== "delivered") {
        continue;
      }

      // 3. SAFE UPDATE (IDEMPOTENT)
      const { error: updateError } = await supabase
        .from("escrow_orders")
        .update({
          status: "released",
          released_at: now,
        })
        .eq("id", escrow.id)
        .eq("status", "delivered"); // prevents double release

      if (updateError) {
        console.error("Release failed:", escrow.id, updateError.message);
        continue;
      }

      released++;

      console.log("💰 AUTO RELEASED:", escrow.id);
    } catch (err) {
      console.error("Auto release crash:", err);
    }
  }

  return {
    processed: escrows.length,
    released,
  };
}




