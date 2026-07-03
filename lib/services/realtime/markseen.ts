import { createBrowserSupabase } from "@/lib/supabase/browser";
const supabase = createBrowserSupabase();

export async function markSeenV2(
  conversationId: string,
  userId: string
) {
  const { error } = await supabase
    .from("conversation_reads")
    .upsert({
      conversation_id: conversationId,
      user_id: userId,
      last_seen_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error("markSeenV2 error:", error.message);
    return { success: false };
  }

  return { success: true };
}




