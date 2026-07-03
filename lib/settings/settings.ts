
import { createServerSupabase } from "@/lib/supabase/server";

export async function getSetting(key: string) {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", key)
    .maybeSingle(); // ✅ safer than .single()

  if (error) {
    console.error("getSetting error:", error.message);
    return null;
  }

  return data?.value ?? null;
}





