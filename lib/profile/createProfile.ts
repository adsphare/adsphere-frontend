import { createServerSupabase } from "@/lib/supabase/server";


export async function ensureProfile(
  userId: string,
  email?: string
) {

  const supabase = await createServerSupabase();



  const {
    data: profile,
    error: findError,
  } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();



  if (findError) {
    throw findError;
  }



  if (profile) {
    return profile;
  }



  const username =
    email?.split("@")[0] ??
    `user_${userId.slice(0,6)}`;


  const now =
    new Date().toISOString();



  const {
    data: newProfile,
    error: createError
  } =
    await supabase
      .from("profiles")
      .insert({

        id: userId,

        username,

        full_name: "",

        avatar_url: "",

        role: "creator",

        trust_score: 0,

        total_sales: 0,

        total_views: 0,

        is_verified: false,

        verification_level: "none",

        kyc_status: "pending",

        fayda_verified: false,

        phone_verified: false,

        auth_method: "email",

        last_active: now,

        last_seen_at: now,

      })
      .select()
      .single();



  if (createError) {
    throw createError;
  }



  return newProfile;

}
