import { createBrowserSupabase } from "@/lib/supabase/browser";


export async function getTrustScore(
  userId: string
) {

  const supabase =
    createBrowserSupabase();


  const {
    data,
    error
  } =
    await supabase
      .from("profiles")
      .select("trust_score")
      .eq("id", userId)
      .single();


  if(error){

    console.error(
      "TRUST QUERY ERROR:",
      error.message
    );

    return 50;
  }


  return data?.trust_score ?? 50;

}

