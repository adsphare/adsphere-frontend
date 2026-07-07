import { createBrowserSupabase } from "@/lib/supabase/browser";

/* =========================
   CLIENT DB
========================= */

export function getDb() {
  return createBrowserSupabase();
}

