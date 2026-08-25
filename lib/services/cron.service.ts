
import { createServerSupabase } from "@/lib/supabase/server";
import { escrowEngine } from "@/lib/domain/escrow/escrowEngine";

export const cronService = {
  async expireBoosts() {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase.rpc(
      "expire_expired_boosts"
    );

    if (error) {
      throw new Error(
        `Boost expiration failed: ${error.message}`
      );
    }

    return {
      processed: Number(data?.processed ?? 0),
      expired: Number(data?.expired ?? 0),
    };
  },

  async autoReleaseEscrows() {
    const supabase = await createServerSupabase();
    const now = new Date().toISOString();

    const { data: escrows, error } = await supabase
      .from("escrow_orders")
      .select("id")
      .eq("status", "delivered")
      .lte("auto_release_at", now);

    if (error) {
      throw new Error(
        `Auto-release fetch failed: ${error.message}`
      );
    }

    let released = 0;
    let failed = 0;

    for (const escrow of escrows ?? []) {
      try {
        await escrowEngine("AUTO_RELEASE", escrow.id);
        released++;
      } catch (error) {
        failed++;

        console.error(
          "Auto-release failed:",
          escrow.id,
          error instanceof Error ? error.message : error
        );
      }
    }

    return {
      processed: escrows?.length ?? 0,
      released,
      failed,
    };
  },
};
