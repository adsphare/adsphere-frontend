import { createBrowserSupabase } from "@/lib/supabase/browser";
const supabase = createBrowserSupabase();

export async function markSeen(conversationId: string, userId: string) {
  const { data, error } = await supabase
    .from("messages")
    .update({
      status: "seen",
      seen_at: new Date().toISOString(),
    })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId)
    .select();

  if (error) {
    console.error("markSeen error:", error.message);
    return { success: false, error };
  }

  return { success: true, data };
}






