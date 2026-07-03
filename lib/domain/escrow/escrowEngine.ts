import { supabaseAdmin } from "@/lib/supabase/admin";

export type EscrowAction =
  | "FUND"
  | "HOLD"
  | "RELEASE"
  | "REFUND"
  | "DISPUTE"
  | "AUTO_RELEASE";

/* =========================
   ESCROW ENGINE (STATE MACHINE)
========================= */
export async function escrowEngine(
  action: EscrowAction,
  escrowId: string
) {
  if (!escrowId) {
    throw new Error("Missing escrowId");
  }

  /* =========================
     FETCH ESCROW
  ========================= */
  const { data: escrow, error: fetchError } = await supabaseAdmin
    .from("escrows")
    .select("*")
    .eq("id", escrowId)
    .single();

  if (fetchError || !escrow) {
    throw new Error("Escrow not found");
  }

  /* =========================
     STATE MACHINE
  ========================= */
  switch (action) {

    /* =========================
       FUND
    ========================= */
    case "FUND": {
      if (escrow.status === "FUNDED") return;

      const autoReleaseAt = new Date();
      autoReleaseAt.setDate(autoReleaseAt.getDate() + 7);

      const { error: updateError } = await supabaseAdmin
        .from("escrows")
        .update({
          status: "FUNDED",
          funded_at: new Date().toISOString(),
          auto_release_at: autoReleaseAt.toISOString(),
          dispute_deadline: autoReleaseAt.toISOString(),
          is_auto_released: false,
        })
        .eq("id", escrowId);

      if (updateError) throw updateError;

      console.log("💰 Escrow FUNDED:", escrowId);
      break;
    }

    /* =========================
       HOLD
    ========================= */
    case "HOLD": {
      const { error: updateError } = await supabaseAdmin
        .from("escrows")
        .update({
          status: "HELD",
          updated_at: new Date().toISOString(),
        })
        .eq("id", escrowId);

      if (updateError) throw updateError;

      console.log("⏸ Escrow HELD:", escrowId);
      break;
    }

    /* =========================
       RELEASE
    ========================= */
    case "RELEASE": {
      if (
        escrow.status !== "FUNDED" &&
        escrow.status !== "HELD"
      ) {
        throw new Error("Escrow not ready for release");
      }

      if (escrow.status === "RELEASED") return;

      const commission = escrow.amount * 0.1;
      const sellerAmount = escrow.amount - commission;

      const { error: updateError } = await supabaseAdmin
        .from("escrows")
        .update({
          status: "RELEASED",
          released_at: new Date().toISOString(),
          commission,
          seller_amount: sellerAmount,
        })
        .eq("id", escrowId);

      if (updateError) throw updateError;

      console.log("🏁 Escrow RELEASED:", escrowId);
      break;
    }

    /* =========================
       AUTO RELEASE
    ========================= */
    case "AUTO_RELEASE": {
      if (escrow.status !== "FUNDED") return;
      if (escrow.status === "RELEASED") return;

      const commission = escrow.amount * 0.1;
      const sellerAmount = escrow.amount - commission;

      const { error: updateError } = await supabaseAdmin
        .from("escrows")
        .update({
          status: "RELEASED",
          released_at: new Date().toISOString(),
          commission,
          seller_amount: sellerAmount,
          is_auto_released: true,
        })
        .eq("id", escrowId);

      if (updateError) throw updateError;

      console.log("⏱ AUTO RELEASED:", escrowId);
      break;
    }

    /* =========================
       REFUND
    ========================= */
    case "REFUND": {
      if (escrow.status === "REFUNDED") return;

      const { error: updateError } = await supabaseAdmin
        .from("escrows")
        .update({
          status: "REFUNDED",
          refunded_at: new Date().toISOString(),
        })
        .eq("id", escrowId);

      if (updateError) throw updateError;

      console.log("↩️ Escrow REFUNDED:", escrowId);
      break;
    }

    /* =========================
       DISPUTE
    ========================= */
    case "DISPUTE": {
      if (escrow.status === "DISPUTED") return;

      const { error: updateError } = await supabaseAdmin
        .from("escrows")
        .update({
          status: "DISPUTED",
          disputed_at: new Date().toISOString(),
        })
        .eq("id", escrowId);

      if (updateError) throw updateError;

      console.log("⚠️ Escrow DISPUTED:", escrowId);
      break;
    }

    /* =========================
       DEFAULT
    ========================= */
    default:
      throw new Error(`Unknown escrow action: ${action}`);
  }
}