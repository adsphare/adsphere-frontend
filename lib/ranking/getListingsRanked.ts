import { createServerSupabase } from "@/lib/supabase/server";
import { rankListing } from "./rankListing";

export async function getRankedListings() {
  const supabase = await createServerSupabase(); // ✅ FIXED

  const { data, error } = await supabase
    .from("listings")
    .select("*");

  if (error) throw new Error(error.message);

  const ranked = (data || []).map((item: any) => ({
    ...item,
   rank: rankListing(item),
  }));

  return ranked.sort((a, b) => b.rank - a.rank);
}
