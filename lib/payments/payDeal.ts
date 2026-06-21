import { supabase } from "@/lib/supabase";

export async function payDeal({
  dealId,
  userId,
}: {
  dealId: string;
  userId: string;
}) {
  const { data: deal, error } = await supabase
    .from("deals")
    .select("*")
    .eq("id", dealId)
    .single();

  if (error || !deal) throw new Error("Deal not found");

  if (deal.buyer_id !== userId) {
    throw new Error("Only buyer can pay");
  }

  const { data, error: updateError } = await supabase
    .from("deals")
    .update({
      payment_status: "paid",
      paid_at: new Date().toISOString(),
      payment_method: "mock",
    })
    .eq("id", dealId)
    .select()
    .single();

  if (updateError) throw updateError;

  return data;
}