"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export function useTyping(userId: string, conversationId: string) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!userId || !conversationId) return;

    const supabase = createBrowserSupabase(); // ✅ FIX

    const channel = supabase.channel(`typing-${conversationId}`);

    channel
      .on("broadcast", { event: "typing" }, (payload: any) => {
        const typingUserId = payload?.payload?.userId;

        if (!typingUserId) return;

        setTypingUsers((prev) => {
          if (!prev.includes(typingUserId)) {
            return [...prev, typingUserId];
          }
          return prev;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, conversationId]);

  return {
    typingUsers,
  };
}