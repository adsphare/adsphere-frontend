"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { createDeal } from "@/lib/messaging/chats";

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  offer_amount?: number;
  offer_status?: string;
};

export default function ChatPage({ params }: { params: { id: string } }) {
  const conversationId = params.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  const [input, setInput] = useState("");
  const [user, setUser] = useState<any>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  /* =========================
     INIT
  ========================= */
  useEffect(() => {
    init();

    const cleanup = subscribe();

    return () => {
      cleanup(); // ✅ safe cleanup
    };
  }, []);

  async function init() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    const { data } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    setConversation(data);

    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    setMessages(msgs || []);

    scrollToBottom();
  }

  /* =========================
     REALTIME (FIXED)
  ========================= */
  function subscribe() {
    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      // ✅ FIX: prevent Promise return issue
      void supabase.removeChannel(channel);
    };
  }

  /* =========================
     SEND MESSAGE
  ========================= */
  async function sendMessage() {
    if (!user || !input.trim()) return;

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      message: input,
      created_at: new Date().toISOString(),
      read: false,
    });

    setInput("");
  }

  /* =========================
     SEND OFFER
  ========================= */
  async function sendOffer() {
    if (!user) return;

    const amount = prompt("Enter offer amount");
    if (!amount) return;

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      message: `💰 Offer: $${amount}`,
      offer_amount: Number(amount),
      offer_status: "pending",
      created_at: new Date().toISOString(),
    });
  }

  /* =========================
     ACCEPT OFFER → CREATE DEAL
  ========================= */
  async function acceptOffer(msg: Message) {
    if (!user || !conversation) return;

    const deal = await createDeal({
      listingId: conversation.listing_id,
      conversationId: conversation.id,
      buyerId: conversation.buyer_id,
      ownerId: conversation.owner_id,
      amount: msg.offer_amount!,
    });

    await supabase
      .from("messages")
      .update({ offer_status: "accepted" })
      .eq("id", msg.id);

    await supabase
      .from("conversations")
      .update({
        last_message: `Deal: $${msg.offer_amount}`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    console.log("Deal created:", deal);
  }

  function scrollToBottom() {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  /* =========================
     UI
  ========================= */
  return (
    <main className="min-h-screen bg-[#050816] text-white flex flex-col">

      {/* HEADER */}
      <div className="p-4 border-b border-white/10">
        <h1 className="text-lg font-semibold">Chat</h1>
        <p className="text-xs text-white/40">
          Marketplace conversation
        </p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMine = msg.sender_id === user?.id;

          return (
            <div
              key={msg.id}
              className={`flex ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                  isMine ? "bg-blue-600" : "bg-white/10"
                }`}
              >
                <div>{msg.message}</div>

                {/* OFFER */}
                {msg.offer_amount && (
                  <div className="mt-2 text-yellow-300 font-bold">
                    Offer: ${msg.offer_amount}
                  </div>
                )}

                {/* ACCEPT BUTTON */}
                {msg.offer_status === "pending" &&
                  !isMine &&
                  msg.offer_amount && (
                    <button
                      onClick={() => acceptOffer(msg)}
                      className="mt-2 px-3 py-1 bg-green-600 rounded"
                    >
                      Accept Offer
                    </button>
                  )}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-white/10 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendOffer}
          className="px-4 py-3 bg-green-600 rounded-xl"
        >
          💰
        </button>

        <button
          onClick={sendMessage}
          className="px-4 py-3 bg-blue-600 rounded-xl"
        >
          Send
        </button>
      </div>
    </main>
  );
}