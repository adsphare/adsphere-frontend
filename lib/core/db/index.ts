import { createBrowserSupabase } from "@/lib/supabase/browser";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Unified DB layer (MVP SAFE)
 * - SSR on server
 * - browser on client
 */
export const db =
  typeof window === "undefined"
    ? createServerSupabase()
    : createBrowserSupabase();