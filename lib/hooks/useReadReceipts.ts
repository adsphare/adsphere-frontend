"use client";

import { useEffect, useState } from "react";
import { readService } from "@/lib/services/realtime/read.service";

type ConversationRead = {
  user_id: string;
  conversation_id: string;
  created_at: string;
};

export function useReadReceipts(conversationId: string) {
  const [reads, setReads] = useState<Record<string, ConversationRead>>({});

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = readService.subscribe(
      conversationId,
      (payload: any) => {
        // ✅ FIX 1: guard payload
        if (!payload?.new) return;

        const row = payload.new as ConversationRead;

        // ✅ FIX 2: safety check
        if (!row.user_id) return;

        setReads((prev) => ({
          ...prev,
          [row.user_id]: row,
        }));
      }
    );

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [conversationId]);

  return { reads };
}