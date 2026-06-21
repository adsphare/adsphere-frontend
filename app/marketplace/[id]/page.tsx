"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { createDeal } from "@/lib/messaging/chats";

export default function ChatPage({ params }: { params: { id: string } }) {
  const conversationId = params.id;

  const [messages, setMessages] = useState<any[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  const [input, setInput] = useState("");
  const [user, setUser] = useState<any>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const { data: auth } = await supabase.auth.getUser();
    setUser(auth.user);

    const { data: conv } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    setConversation(conv);

    loadMessages();
    subscribe();
  }

  async function loadMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    setMessages(data || []);
  }

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
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }

  async function sendMessage() {
    if (!user || !input.trim()) return;

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      message: input,
      created_at: new Date().toISOString(),
    });

    setInput("");
  }

  async function sendOffer() {
    const amount = prompt("Offer amount?");
    if (!amount || !user) return;

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      message: `💰 Offer: $${amount}`,
      offer_amount: Number(amount),
      offer_status: "pending",
      created_at: new Date().toISOString(),
    });
  }

  async function acceptOffer(msg: any) {
    if (!conversation) return;

    await createDeal({
      listingId: conversation.listing_id,
      conversationId: conversation.id,
      buyerId: conversation.buyer_id,
      ownerId: conversation.owner_id,
      amount: msg.offer_amount,
    });

    await supabase
      .from("messages")
      .update({ offer_status: "accepted" })
      .eq("id", msg.id);
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#050816] text-white">

      {/* HEADER */}
      <div className="p-4 border-b border-white/10">
        <h1 className="font-bold">Chat</h1>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">

        {messages.map((msg) => {
          const isMine = msg.sender_id === user?.id;

          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[70%] p-3 rounded-xl bg-white/10">

                <p>{msg.message}</p>

                {msg.offer_amount && (
                  <p className="text-yellow-400 text-sm mt-1">
                    Offer: ${msg.offer_amount}
                  </p>
                )}

                {msg.offer_status === "pending" &&
                  !isMine && (
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
      <div className="p-3 flex gap-2 border-t border-white/10">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-white/5"
          placeholder="Message..."
        />

        <button onClick={sendOffer} className="px-3 bg-green-600 rounded">
          💰
        </button>

        <button onClick={sendMessage} className="px-3 bg-blue-600 rounded">
          Send
        </button>

      </div>

    </main>
  );
}