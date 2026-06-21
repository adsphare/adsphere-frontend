import { supabase } from "@/lib/supabase";

export async function ensureProfile(user: any) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (data) return data;

  const { data: created } = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      username: user.email?.split("@")[0],
      trust_score: 0,
      total_sales: 0,
      total_views: 0,
    })
    .select()
    .single();

  return created;
}