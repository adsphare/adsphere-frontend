import { createBrowserSupabase } from "@/lib/supabase/browser";

export async function getUser() {
  const supabase = createBrowserSupabase();

  const { data, error } = await supabase.auth.getUser();

  return {
    user: error ? null : data.user,
  };
}