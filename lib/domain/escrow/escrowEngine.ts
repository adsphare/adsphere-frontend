import { supabaseAdmin } from "@/lib/supabase/admin";

export type EscrowAction =
  | "FUND"
  | "HOLD"
  | "RELEASE"
  | "REFUND"
  | "DISPUTE"
  | "AUTO_RELEASE";

const COMMISSION_RATE = 0.1;

export async function escrowEngine(
  action: EscrowAction,
  escrowId: string
) {
  if (!escrowId) {
    throw new Error("Missing escrowId");
  }

  const { data: escrow, error: fetchError } = await supabaseAdmin
    .from("escrow_orders")
    .select("*")
    .eq("id", escrowId)
    .single();

  if (fetchError || !escrow) {
    throw new Error("Escrow not found");
  }

  const now = new Date().toISOString();

  switch (action) {
    case "FUND": {
      if (escrow.status === "funded") {
        return escrow;
      }

      if (escrow.status !== "pending") {
        throw new Error(
          `Cannot fund escrow from status: ${escrow.status}`
        );
      }

      const autoRelease = new Date();
      autoRelease.setDate(autoRelease.getDate() + 7);

      const autoReleaseAt = autoRelease.toISOString();

      const { data, error } = await supabaseAdmin
        .from("escrow_orders")
        .update({
          status: "funded",
          funded_at: now,
          auto_release_at: autoReleaseAt,
          buyer_confirmation_deadline: autoReleaseAt,
          is_locked: true,
          updated_at: now,
        })
        .eq("id", escrowId)
        .eq("status", "pending")
        .select()
        .single();

      if (error) throw error;

      console.log("💰 Escrow FUNDED:", escrowId);

      return data;
    }

    case "HOLD": {
      if (escrow.status === "released") {
        throw new Error("Cannot hold a released escrow");
      }

      const { data, error } = await supabaseAdmin
        .from("escrow_orders")
        .update({
          is_locked: true,
          updated_at: now,
        })
        .eq("id", escrowId)
        .select()
        .single();

      if (error) throw error;

      console.log("⏸ Escrow HELD:", escrowId);

      return data;
    }

    case "RELEASE": {
      if (escrow.status === "released") {
        return escrow;
      }

      if (
        escrow.status !== "funded" &&
        escrow.status !== "delivered" &&
        escrow.status !== "disputed"
      ) {
        throw new Error(
          `Escrow not ready for release from status: ${escrow.status}`
        );
      }

      if (escrow.dispute_status === "open" ||
          escrow.dispute_status === "under_review") {
        throw new Error("Cannot release escrow while dispute is active");
      }

      const commission = Number(escrow.amount) * COMMISSION_RATE;
      const sellerAmount = Number(escrow.amount) - commission;

      const { data, error } = await supabaseAdmin
        .from("escrow_orders")
        .update({
          status: "released",
          released_at: now,
          commission,
          seller_amount: sellerAmount,
          is_locked: false,
          updated_at: now,
        })
        .eq("id", escrowId)
        .in("status", ["funded", "delivered"])
        .select()
        .single();

      if (error) throw error;

      console.log("🏁 Escrow RELEASED:", escrowId);

      return data;
    }

    case "AUTO_RELEASE": {
      if (escrow.status === "released") {
        return escrow;
      }

      if (
        escrow.status !== "funded" &&
        escrow.status !== "delivered"
      ) {
        return escrow;
      }

      if (
        escrow.dispute_status === "open" ||
        escrow.dispute_status === "under_review"
      ) {
        console.log(
          "🛑 AUTO RELEASE BLOCKED — active dispute:",
          escrowId
        );

        return escrow;
      }

      if (
        escrow.auto_release_at &&
        new Date(escrow.auto_release_at) > new Date()
      ) {
        return escrow;
      }

      const commission = Number(escrow.amount) * COMMISSION_RATE;
      const sellerAmount = Number(escrow.amount) - commission;

      const { data, error } = await supabaseAdmin
        .from("escrow_orders")
        .update({
          status: "released",
          released_at: now,
          commission,
          seller_amount: sellerAmount,
          is_auto_released: true,
          is_locked: false,
          updated_at: now,
        })
        .eq("id", escrowId)
        .in("status", ["funded", "delivered"])
        .select()
        .single();

      if (error) throw error;

      console.log("⏱ AUTO RELEASED:", escrowId);

      return data;
    }

    case "REFUND": {
      if (escrow.status === "refunded") {
        return escrow;
      }

      if (escrow.status === "released") {
        throw new Error("Cannot refund a released escrow");
      }

      const { data, error } = await supabaseAdmin
        .from("escrow_orders")
        .update({
          status: "refunded",
          refunded_at: now,
          is_locked: false,
          updated_at: now,
        })
        .eq("id", escrowId)
        .not("status", "eq", "released")
        .select()
        .single();

      if (error) throw error;

      console.log("↩️ Escrow REFUNDED:", escrowId);

      return data;
    }

    case "DISPUTE": {
      if (escrow.status === "released") {
        throw new Error("Cannot dispute a released escrow");
      }

      const { data, error } = await supabaseAdmin
        .from("escrow_orders")
        .update({
          status: "disputed",
          dispute_status: "open",
          disputed_at: now,
          is_locked: true,
          updated_at: now,
        })
        .eq("id", escrowId)
        .not("status", "eq", "released")
        .select()
        .single();

      if (error) throw error;

      console.log("⚠️ Escrow DISPUTED:", escrowId);

      return data;
    }

    default:
      throw new Error(`Unknown escrow action: ${action}`);
  }
}