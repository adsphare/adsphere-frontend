"use client";

import { useEffect } from "react";
import { presenceService } from "@/lib/services/realtime/presence.service";

export function usePresence(userId: string | null) {
  useEffect(() => {
    if (!userId) {
      return;
    }

    const subscription = presenceService.subscribe({
      channelName: "presence:users",
      user: {
        id: userId,
      },
    });

    return () => {
      void subscription.destroy();
    };
  }, [userId]);
}
