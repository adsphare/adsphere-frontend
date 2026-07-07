import { createBrowserSupabase } from "@/lib/supabase/browser";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * SINGLE DB ENTRY POINT
 * NEVER create Supabase clients anywhere else
 */

export const db =
  typeof window === "undefined"
    ? createServerSupabase()
    : createBrowserSupabase();
