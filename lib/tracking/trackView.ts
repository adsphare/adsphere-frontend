import { createBrowserSupabase } from "@/lib/supabase/browser";
import { updateRank } from "@/lib/ranking/updateRank";

/**
 * Tracks listing views safely and updates ranking
 */
export async function trackView(listingId: string) {
  const supabase = createBrowserSupabase();

  if (!listingId) return;

  try {
    // 1. Get current views
    const { data, error } = await supabase
      .from("listings")
      .select("views")
      .eq("id", listingId)
      .single();

    if (error || !data) return;

    const newViews = (data.views || 0) + 1;

    // 2. Update views
    const { error: updateError } = await supabase
      .from("listings")
      .update({ views: newViews })
      .eq("id", listingId);

    if (updateError) {
      console.error("view update error:", updateError.message);
      return;
    }

    // 3. Update ranking after view
    await updateRank(listingId);
  } catch (err) {
    console.error("trackView error:", err);
  }
}