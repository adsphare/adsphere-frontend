import { createServerSupabase } from "@/lib/supabase/server";

type Action = "refund" | "release";

export async function resolveDispute({
  disputeId,
  action,
  adminId,
}: {
  disputeId: string;
  action: Action;
  adminId: string;
}) {
  const supabase = createServerSupabase();

  // 1. Get dispute
  const { data: dispute, error } = await supabase
    .from("disputes")
    .select("*")
    .eq("id", disputeId)
    .single();

  if (error || !dispute) {
    throw new Error("Dispute not found");
  }

  // 2. Safety check (must still be open)
  if (dispute.status !== "open") {
    throw new Error("Dispute already resolved");
  }

  // 3. Get escrow
  const { data: escrow } = await supabase
    .from("escrow_orders")
    .select("*")
    .eq("id", dispute.escrow_id)
    .single();

  if (!escrow) {
    throw new Error("Escrow not found");
  }

  // 4. Lock escrow during resolution
  await supabase
    .from("escrow_orders")
    .update({
      is_locked: true,
      status: "disputed",
    })
    .eq("id", escrow.id);

  // 5. Apply decision
  if (action === "release") {
    await supabase
      .from("escrow_orders")
      .update({
        status: "released",
        is_locked: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", escrow.id);
  }

  if (action === "refund") {
    await supabase
      .from("escrow_orders")
      .update({
        status: "refunded",
        is_locked: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", escrow.id);
  }

  // 6. Close dispute
  await supabase
    .from("disputes")
    .update({
      status: "resolved",
      resolution: action,
      resolved_by: adminId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", disputeId);

  return {
    success: true,
    action,
    escrowId: escrow.id,
  };
}




