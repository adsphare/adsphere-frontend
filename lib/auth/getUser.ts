import { createServerSupabase } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return null;

  return data.user;
}






