import { createBrowserSupabase } from "@/lib/supabase/browser";

/* =========================
   TRACK LISTING VIEW
========================= */
export async function trackView(listingId: string, userId?: string) {
  const supabase = createBrowserSupabase();

  if (!listingId) return;

  try {
    /* =========================
       OPTIONAL: prevent spam views
       (simple guard, not strict analytics)
    ========================= */
    if (userId) {
      const { data: existing } = await supabase
        .from("listing_views")
        .select("*")
        .eq("listing_id", listingId)
        .eq("user_id", userId)
        .maybeSingle();

      // if already viewed recently, skip
      if (existing) return;

      await supabase.from("listing_views").insert({
        listing_id: listingId,
        user_id: userId,
        created_at: new Date().toISOString(),
      });
    }

    /* =========================
       INCREMENT VIEW COUNT
    ========================= */
    const { error } = await supabase.rpc("increment_listing_views", {
      row_id: listingId,
    });

    if (error) {
      console.error("trackView error:", error.message);
    }
  } catch (err) {
    console.error("trackView exception:", err);
  }
}

