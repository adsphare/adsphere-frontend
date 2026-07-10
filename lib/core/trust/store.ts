import { createServerSupabase } from "@/lib/supabase/server";
import { TrustProfile } from "./types";


export async function getTrust(
  userId: string
): Promise<TrustProfile | null> {

  const supabase = await createServerSupabase();


  const {
    data,
    error,
  } =
    await supabase
      .from("trust_scores")
      .select("*")
      .eq("user_id", userId)
      .single();



  if (error) {

    console.error(
      "GET TRUST ERROR:",
      error.message
    );

    return null;

  }


  return data;

}
