import { createBrowserSupabase } from "@/lib/supabase/browser";

/**
 * Shared client database instance
 *
 * Used by:
 * - chat
 * - marketplace
 * - notifications
 * - trust
 * - realtime
 *
 * Server-only code should use getServerDb()
 */

export const db = createBrowserSupabase();
