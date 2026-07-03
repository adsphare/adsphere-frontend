import { createBrowserSupabase } from "@/lib/supabase/browser";

/* =========================
   GET MESSAGES
========================= */
export async function getMessages(conversationId: string) {
  const supabase = createBrowserSupabase();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getMessages error:", error.message);
    return [];
  }

  return data ?? [];
}

/* =========================
   SEND MESSAGE
========================= */
export async function sendMessage({
  conversationId,
  senderId,
  receiverId,
  content,
}: {
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
}) {
  const supabase = createBrowserSupabase();

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        conversation_id: conversationId,
        sender_id: senderId,
        receiver_id: receiverId,
        content,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("sendMessage error:", error.message);
    return null;
  }

  return data;
}