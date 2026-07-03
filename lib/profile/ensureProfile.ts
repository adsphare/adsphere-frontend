import { createBrowserSupabase } from "@/lib/supabase/browser";

export async function ensureProfile(user: any) {
  const supabase = createBrowserSupabase();

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (data) return data;

  const { data: created, error } = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      username: user.email?.split("@")[0] ?? "user",
      trust_score: 0,
      total_sales: 0,
      total_views: 0,
    })
    .select()
    .single();

  if (error) throw error;

  return created;
}