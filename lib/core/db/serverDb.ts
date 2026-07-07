import { createServerSupabase } from "@/lib/supabase/server";

export function getServerDb() {
  return createServerSupabase();
}
