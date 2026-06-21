import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getSetting(key: string) {
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", key)
    .single();

  return data?.value;
}