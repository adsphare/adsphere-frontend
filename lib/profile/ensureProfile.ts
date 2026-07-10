import { createServerSupabase } from "@/lib/supabase/server";


export async function ensureProfile(user: any) {

  const supabase = await createServerSupabase();


  const {
    data: profile,
    error: findError,
  } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();


  if (findError) {
    throw findError;
  }


  // Existing profile
  if (profile) {

    return {
      exists: true,
      profile,
    };

  }


  const username =
    user.email?.split("@")[0] ??
    `user_${user.id.slice(0, 6)}`;


  const now = new Date().toISOString();


  const {
    data: created,
    error: createError,
  } =
    await supabase
      .from("profiles")
      .insert({

        id: user.id,

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


  return {
    exists: false,
    profile: created,
  };

}
