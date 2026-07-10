"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import { chat } from "@/lib/core/chat";
import { db } from "@/lib/core/db";
import { usePresence } from "@/lib/core/presence/usePresence";

import MessageBubble from "@/components/chat/MessageBubble";
import MessageInput from "@/components/chat/MessageInput";

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

type TypingPayload = {
  payload?: {
    userId?: string;
    conversationId?: string;
  };
};

export default function ChatPage() {
  const { id: conversationId } = useParams<{ id: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const typingChannelRef = useRef<any>(null);

  /* =========================
     LOAD USER
  ========================= */
  useEffect(() => {
    chat.getUser().then((user) => {
      setUserId(user?.id || null);
    });
  }, []);

  /* =========================
     PRESENCE SYSTEM
  ========================= */
  usePresence(userId ?? null);

  /* =========================
     LOAD MESSAGES
  ========================= */
  async function loadMessages() {
    if (!conversationId) return;

    const data = await chat.getMessages(conversationId);
    setMessages(data);
  }

  /* =========================
     REALTIME MESSAGES
  ========================= */
  useEffect(() => {
    if (!conversationId) return;

    loadMessages();

    const unsubscribe = chat.subscribe(conversationId, (msg: Message) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.id);
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    return unsubscribe;
  }, [conversationId]);

  /* =========================
     MARK AS READ
  ========================= */
  useEffect(() => {
    if (!conversationId || !userId) return;

    chat.markAsRead(conversationId, userId);
  }, [conversationId, userId]);

  /* =========================
     TYPING SYSTEM (FIXED)
  ========================= */
  useEffect(() => {
    if (!conversationId || !userId) return;

    const channel = db.channel(`typing-${conversationId}`);
    typingChannelRef.current = channel;

    channel
      .on(
        "broadcast",
        { event: "typing" },
        (payload: TypingPayload) => {
          const senderId = payload.payload?.userId;

          if (!senderId || senderId === userId) return;

          setTypingUsers((prev) => {
            if (prev.includes(senderId)) return prev;
            return [...prev, senderId];
          });

          setTimeout(() => {
            setTypingUsers((prev) =>
              prev.filter((id) => id !== senderId)
            );
          }, 2000);
        }
      )
      .subscribe();

    return () => {
      db.removeChannel(channel);
    };
  }, [conversationId, userId]);

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     SEND MESSAGE
  ========================= */
  async function handleSend(text: string) {
    if (!userId || !conversationId) return;

    await chat.sendMessage({
      conversationId,
      senderId: userId,
      content: text,
    });
  }

  /* =========================
     SEND TYPING EVENT
  ========================= */
  function handleTyping() {
    if (!conversationId || !userId) return;

    const channel = typingChannelRef.current;
    if (!channel) return;

    channel.send({
      type: "broadcast",
      event: "typing",
      payload: {
        userId,
        conversationId,
      },
    });
  }

  return (
    <div className="h-screen flex flex-col bg-[#050816] text-white">

      {/* HEADER */}
      <div className="p-4 border-b border-white/10">
        <h1 className="font-semibold">Conversation</h1>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            content={m.content}
            isMine={m.sender_id === userId}
            createdAt={m.created_at}
          />
        ))}

        {/* TYPING INDICATOR */}
        {typingUsers.length > 0 && (
          <div className="text-sm text-white/50 px-2 py-1 animate-pulse">
            Someone is typing...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <MessageInput
        onSend={handleSend}
        onTyping={handleTyping}
      />
    </div>
  );
}
