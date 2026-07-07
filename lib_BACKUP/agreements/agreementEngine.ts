import { createServerSupabase } from "@/lib/supabase/server";

/* =========================
   TYPES (STANDARDIZED - FIXED)
========================= */
export type AgreementAction =
  | "CREATE"
  | "ACCEPT"
  | "REJECT"
  | "COMPLETE"
  | "CANCEL";

/* =========================
   AGREEMENT ENGINE
========================= */
export async function agreementEngine(
  action: AgreementAction,
  agreementId: string
) {
  const supabase = createServerSupabase();

  // 1. Fetch agreement
  const { data: agreement, error } = await supabase
    .from("agreements")
    .select("*")
    .eq("id", agreementId)
    .single();

  if (error || !agreement) {
    throw new Error("Agreement not found");
  }

  /* =========================
     ACCEPT → CREATE ESCROW
  ========================= */
  if (action === "ACCEPT") {
    if (agreement.status !== "pending") {
      throw new Error("Already processed");
    }

    // update agreement
    const { data: updated, error: updateError } = await supabase
      .from("agreements")
      .update({
        status: "active",
        accepted_at: new Date().toISOString(),
      })
      .eq("id", agreementId)
      .select()
      .single();

    if (updateError) throw updateError;

    // prevent duplicate escrow
    const { data: existing } = await supabase
      .from("escrow_orders")
      .select("id")
      .eq("agreement_id", agreementId)
      .maybeSingle();

    if (existing) {
      return { agreement: updated, escrow: existing };
    }

    // create escrow
    const { data: escrow, error: escrowError } = await supabase
      .from("escrow_orders")
      .insert({
        agreement_id: agreementId,
        conversation_id: agreement.conversation_id,
        buyer_id: agreement.buyer_id,
        seller_id: agreement.seller_id,
        amount: agreement.price,
        currency: agreement.currency ?? "usd",
        status: "pending",
        is_locked: true,
        auto_release_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      })
      .select()
      .single();

    if (escrowError) throw escrowError;

    return { agreement: updated, escrow };
  }

  /* =========================
     REJECT
  ========================= */
  if (action === "REJECT") {
    const { data, error: rejectError } = await supabase
      .from("agreements")
      .update({
        status: "rejected",
      })
      .eq("id", agreementId)
      .select()
      .single();

    if (rejectError) throw rejectError;

    return data;
  }

  /* =========================
     COMPLETE
  ========================= */
  if (action === "COMPLETE") {
    const { data, error: completeError } = await supabase
      .from("agreements")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", agreementId)
      .select()
      .single();

    if (completeError) throw completeError;

    return data;
  }

  /* =========================
     CREATE (FUTURE USE)
  ========================= */
  if (action === "CREATE") {
    throw new Error("Create flow not implemented yet");
  }

  /* =========================
     CANCEL
  ========================= */
  if (action === "CANCEL") {
    const { data, error: cancelError } = await supabase
      .from("agreements")
      .update({
        status: "cancelled",
      })
      .eq("id", agreementId)
      .select()
      .single();

    if (cancelError) throw cancelError;

    return data;
  }

  throw new Error("Invalid action");
}

