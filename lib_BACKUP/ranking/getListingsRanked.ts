
import { createServerSupabase } from "@/lib/supabase/server";
import { calculateRank } from "./rank";

export async function getRankedListings() {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("listings")
    .select("*");

  if (error) throw new Error(error.message);

  return (data || [])
    .map((item) => ({
      ...item,
      rank: calculateRank(item),
    }))
    .sort((a, b) => b.rank - a.rank);
}






