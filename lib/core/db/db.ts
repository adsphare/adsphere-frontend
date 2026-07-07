import { createBrowserSupabase } from "@/lib/supabase/browser";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * EXPLICIT DB FACTORY (NO AUTO MAGIC)
 * You choose server or client intentionally
 */

export const db = {
  server: createServerSupabase,
  browser: createBrowserSupabase,
};
