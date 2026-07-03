import { createServerSupabase } from "@/lib/supabase/server";

export async function disputeEngine({
  escrowId,
  userId,
  reason,
}: {
  escrowId: string;
  userId: string;
  reason?: string;
}) {
  const supabase = createServerSupabase();

  // 1. Create dispute
  const { data: dispute, error } = await supabase
    .from("disputes")
    .insert({
      escrow_id: escrowId,
      opened_by: userId,
      reason: reason || "No reason provided",
      status: "open",
    })
    .select()
    .single();

  if (error) throw error;

  // 2. Lock escrow
  await supabase
    .from("escrow_orders")
    .update({
      status: "disputed",
      is_locked: true,
      disputed_at: new Date().toISOString(),
    })
    .eq("id", escrowId);

  return dispute;
}




