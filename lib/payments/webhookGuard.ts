import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Prevent duplicate webhook processing
 */
export async function isEventProcessed(eventId: string) {
  const supabase = createServerSupabase();

  const { data } = await supabase
    .from("payment_events")
    .select("id")
    .eq("id", eventId)
    .maybeSingle();

  return !!data;
}

/**
 * Lock event BEFORE processing (VERY IMPORTANT)
 */
export async function markEventProcessed(input: {
  id: string;
  provider: "stripe" | "chapa";
  raw?: any;
  escrowId?: string;
}) {
  const supabase = createServerSupabase();

  await supabase.from("payment_events").insert({
    id: input.id,
    provider: input.provider,
    raw: input.raw,
    escrow_id: input.escrowId,
  });
}




