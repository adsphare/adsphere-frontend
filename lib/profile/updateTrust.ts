import { supabase } from "@/lib/supabase";
import { calculateRank } from "@/lib/ranking/calculateRank";;

export async function updateRank(listingId: string) {
  const { data } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single();

  if (!data) return;

  const rank = calculateRank(data);

  await supabase
    .from("listings")
    .update({ rank })
    .eq("id", listingId);
}