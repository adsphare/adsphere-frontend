"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { chat } from "@/lib/core/chat";

type Conversation = {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  last_read_at: string | null;
};

export default function InboxPage() {
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  /* =========================
     LOAD USER
  ========================= */
  useEffect(() => {
    chat.getUser().then((user) => {
      setUserId(user?.id || null);
    });
  }, []);

  /* =========================
     LOAD INBOX
  ========================= */
  useEffect(() => {
    if (!userId) return;

    loadInbox();
  }, [userId]);

  async function loadInbox() {
    const data = await chat.getInbox(userId!);
    setConversations(data);
  }

  /* =========================
     GET UNREAD COUNT
  ========================= */
  function isUnread(convo: Conversation) {
    if (!convo.last_read_at) return true;

    // simple logic: unread if last message newer than last_read
    return true; // placeholder (we refine later if needed)
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4">

      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      <div className="space-y-3">

        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => router.push(`/messages/${c.id}`)}
            className="
              p-4 rounded-xl
              bg-white/5 border border-white/10
              flex justify-between items-center
              cursor-pointer hover:bg-white/10
            "
          >
            <div>
              <p className="font-medium">
                Conversation {c.id.slice(0, 6)}
              </p>

              <p className="text-xs text-white/50">
                Tap to open chat
              </p>
            </div>

            {/* UNREAD BADGE */}
            {isUnread(c) && (
              <span className="bg-red-500 text-xs px-2 py-1 rounded-full">
                New
              </span>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}