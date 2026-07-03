
import { createBrowserSupabase } from "@/lib/supabase/browser";

const supabase = createBrowserSupabase();

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: any;
  type?: "text" | "intent";
  created_at: string;
};

export const chatService = {
  /* =========================
     SEND MESSAGE
  ========================= */
  async sendMessage({
    conversationId,
    senderId,
    content,
    type = "text",
  }: {
    conversationId: string;
    senderId: string;
    content: any;
    type?: "text" | "intent";
  }) {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        type,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  /* =========================
     REALTIME SUBSCRIBE
  ========================= */
  subscribeMessages(
    conversationId: string,
    callback: (message: Message) => void
  ) {
    const channelName = `messages:${conversationId}`;

    // remove duplicate channels safely
    const existing = supabase
      .getChannels()
      .find((c) => c.topic?.includes(channelName));

    if (existing) {
      supabase.removeChannel(existing);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: { new: Message }) => {
          callback(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};