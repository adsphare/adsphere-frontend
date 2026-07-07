import { createServerSupabase } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = createServerSupabase();

  const { data, error } = await supabase.auth.getUser();

  return {
    user: error ? null : data.user,
  };
}

