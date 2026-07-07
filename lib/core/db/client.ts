import { createServerSupabase } from "@/lib/supabase/server";
import { createBrowserSupabase } from "@/lib/supabase/browser";

/**
 * ⚠️ IMPORTANT ARCHITECTURE RULE
 * - Server Components / Server Actions → server client
 * - Client Components → browser client
 *
 * This file MUST NOT be imported in shared server/client ambiguous modules
 */

function isServer() {
  return typeof window === "undefined";
}

/**
 * Unified DB accessor
 * Safe for Next.js App Router
 */
export const db = isServer()
  ? createServerSupabase()
  : createBrowserSupabase();
