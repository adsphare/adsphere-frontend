"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const { data: authData } = await supabase.auth.getUser();

    if (!authData?.user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .or(
        `sender_id.eq.${authData.user.id},receiver_id.eq.${authData.user.id}`
      )
      .order("created_at", { ascending: false });

    if (!error) {
      setMessages(data || []);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="text-white">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-3xl font-bold">
          Messages
        </h1>

        <p className="text-white/50 mt-2">
          Conversations from listings and bookings
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <p className="text-white">
                {msg.message}
              </p>

              <div className="mt-3 text-xs text-white/40">
                Listing: {msg.listing_id}
              </div>

              <div className="text-xs text-white/40">
                {new Date(
                  msg.created_at
                ).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}