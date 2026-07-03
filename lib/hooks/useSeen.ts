"use client";

import { useEffect } from "react";
import { markSeen } from "@/lib/services/seen.service";

export function useSeen(conversationId: string, userId: string) {
  useEffect(() => {
    if (!conversationId || !userId) return;

    markSeen(conversationId, userId);
  }, [conversationId, userId]);
}





