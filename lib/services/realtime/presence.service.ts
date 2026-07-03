import { createBrowserSupabase } from "@/lib/supabase/browser";
import type { RealtimeChannel } from "@supabase/supabase-js";
const supabase = createBrowserSupabase();

type PresenceUser = {
  id: string;
  name?: string;
};

type PresenceEvent =
  | {
      type: "sync";
      state: Record<string, any>;
    }
  | {
      type: "join";
      key: string;
      newPresences: any[];
    }
  | {
      type: "leave";
      key: string;
      leftPresences: any[];
    };

export const presenceService = {
  subscribe({
    channelName,
    user,
    onUpdate,
  }: {
    channelName: string;
    user: PresenceUser;
    onUpdate?: (event: PresenceEvent) => void;
  }) {
    // Remove existing channel with same topic
    const existing = supabase
      .getChannels()
      .find((c) => c.topic === `realtime:${channelName}`);

    if (existing) {
      void supabase.removeChannel(existing);
    }

    const channel: RealtimeChannel = supabase.channel(channelName, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        onUpdate?.({
          type: "sync",
          state: channel.presenceState(),
        });
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        onUpdate?.({
          type: "join",
          key,
          newPresences,
        });
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        onUpdate?.({
          type: "leave",
          key,
          leftPresences,
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user_id: user.id,
            name: user.name ?? "User",
            online_at: new Date().toISOString(),
          });
        }
      });

    return {
      channel,

      async destroy() {
        try {
          await channel.untrack();
        } catch {
          // ignore
        }

        await supabase.removeChannel(channel);
      },
    };
  },
};




