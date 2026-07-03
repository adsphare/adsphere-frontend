import { createBrowserSupabase } from "@/lib/supabase/browser";
import type { RealtimeChannel } from "@supabase/supabase-js";
const supabase = createBrowserSupabase();

;

/* =========================
   TYPES
========================= */

type TypingPayload = {
  userId: string;
  username: string;
  timestamp: number;
};

type StopTypingPayload = {
  userId: string;
  timestamp: number;
};

export type TypingEvent =
  | {
      type: "typing";
      data: TypingPayload;
    }
  | {
      type: "stop_typing";
      data: StopTypingPayload;
    };

/* =========================
   SERVICE
========================= */

export const typingService = {
  subscribe(
    conversationId: string,
    callback: (event: TypingEvent) => void
  ) {
    const channelName = `typing:${conversationId}`;

    /* -------------------------
       REMOVE DUPLICATE CHANNELS
    ------------------------- */
    const existing = supabase
      .getChannels()
      .find((c: RealtimeChannel) =>
        c.topic?.includes(channelName)
      );

    if (existing) {
      supabase.removeChannel(existing);
    }

    /* -------------------------
       CREATE CHANNEL
    ------------------------- */
    const channel: RealtimeChannel = supabase.channel(channelName);

    channel
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        const data = payload as TypingPayload;

        if (!data?.userId) return;

        callback({
          type: "typing",
          data,
        });
      })
      .on("broadcast", { event: "stop_typing" }, ({ payload }) => {
        const data = payload as StopTypingPayload;

        if (!data?.userId) return;

        callback({
          type: "stop_typing",
          data,
        });
      })
      .subscribe();

    /* -------------------------
       RETURN CONTROLS
    ------------------------- */
    return {
      channel,

      async sendTyping(userId: string, username = "Someone") {
        await channel.send({
          type: "broadcast",
          event: "typing",
          payload: {
            userId,
            username,
            timestamp: Date.now(),
          },
        });
      },

      async sendStopTyping(userId: string) {
        await channel.send({
          type: "broadcast",
          event: "stop_typing",
          payload: {
            userId,
            timestamp: Date.now(),
          },
        });
      },

      async destroy() {
        try {
          await supabase.removeChannel(channel);
        } catch (err) {
          console.error("Failed to remove typing channel:", err);
        }
      },
    };
  },
};




