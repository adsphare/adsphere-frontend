import { createBrowserSupabase } from "@/lib/supabase/browser";

export function getBrowserDb() {
  return createBrowserSupabase();
}
