import { createServerSupabase } from "@/lib/supabase/server";

/* =========================
   MESSAGE SERVICE
========================= */
export const messageService = {
  // 💬 SEND MESSAGE
  async sendMessage({
    conversationId,
    senderId,
    message,
  }: {
    conversationId: string;
    senderId: string;
    message: string;
  }) {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        message: message.trim(),
        status: "sent",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  // 🟡 MARK DELIVERED
  async markDelivered(messageId: string) {
    const supabase = await createServerSupabase();

    const { error } = await supabase
      .from("messages")
      .update({
        status: "delivered",
        delivered_at: new Date().toISOString(),
      })
      .eq("id", messageId);

    if (error) throw error;

    return { success: true };
  },

  // 👀 MARK SEEN
  async markSeen(conversationId: string, userId: string) {
    const supabase = await createServerSupabase();

    const { error } = await supabase
      .from("messages")
      .update({
        status: "seen",
        seen_at: new Date().toISOString(),
      })
      .eq("conversation_id", conversationId)
      .neq("sender_id", userId);

    if (error) throw error;

    return { success: true };
  },

  // 📥 GET MESSAGES
  async getMessages(conversationId: string) {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return data || [];
  },
};






