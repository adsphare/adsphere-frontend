import { createBrowserSupabase } from "@/lib/supabase/browser";
const supabase = createBrowserSupabase();

import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";

type ConversationRead = {
  id: string;
  conversation_id: string;
  user_id: string;
  last_read_message_id: string | null;
  updated_at: string;
};

export const readService = {
  subscribe(
    conversationId: string,
    callback: (
      payload: RealtimePostgresChangesPayload<ConversationRead>
    ) => void
  ) {
    const topic = `reads:${conversationId}`;

    // Remove duplicate subscription
    const existing = supabase
      .getChannels()
      .find((c) => c.topic === `realtime:${topic}`);

    if (existing) {
      void supabase.removeChannel(existing);
    }

    const channel: RealtimeChannel = supabase
      .channel(topic)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversation_reads",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          callback(
            payload as RealtimePostgresChangesPayload<ConversationRead>
          );
        }
      )
      .subscribe();

    return async () => {
      await supabase.removeChannel(channel);
    };
  },
};




