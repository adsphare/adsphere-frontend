import { createServerSupabase } from "@/lib/supabase/server";


export async function updateTrust(
  userId: string,
  trustScore: number
) {

  const supabase = await createServerSupabase();


  const {
    data,
    error
  } =
    await supabase
      .from("profiles")
      .update({

        trust_score: trustScore,

        last_active:
          new Date().toISOString(),

      })
      .eq("id", userId)
      .select()
      .single();



  if (error) {
    throw error;
  }



  return data;

}
