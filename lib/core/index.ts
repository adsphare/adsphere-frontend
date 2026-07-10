import { createBrowserSupabase } from "@/lib/supabase/browser";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Unified DB access layer (MVP SAFE)
 * - Server uses SSR client
 * - Browser uses client
 */
export const db =
  typeof window === "undefined"
    ? createServerSupabase()
    : createBrowserSupabase();
