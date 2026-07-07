"use client";

import { useEffect, useState } from "react";
import { chatService } from "@/lib/services/realtime/chat.service";

export function useChatMessages(conversationId: string) {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = chatService.subscribeMessages(
      conversationId,
      (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      }
    );

    return () => unsubscribe();
  }, [conversationId]);

  return { messages, setMessages };
}





