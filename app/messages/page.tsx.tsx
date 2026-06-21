"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Conversation = {
  id: string;
  listing_id: string;
  buyer_id: string;
  owner_id: string;

  last_message?: string;
  last_message_at?: string;

  listing?: {
    title: string;
    image?: string;
  };
};

export default function MessagesPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    load();
    subscribe();
  }, []);

  /* =========================
     LOAD CONVERSATIONS
  ========================= */
  async function load() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("conversations")
      .select(`
        *,
        listing:listings (
          title,
          image
        )
      `)
      .or(`buyer_id.eq.${user.id},owner_id.eq.${user.id}`)
      .order("last_message_at", { ascending: false });

    setConversations(data || []);
    setLoading(false);
  }

  /* =========================
     REALTIME UPDATES
  ========================= */
  function subscribe() {
    const channel = supabase
      .channel("conversations-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        () => {
          load();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /* =========================
     UI
  ========================= */
  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-10">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-bold">Messages</h1>
        <p className="text-white/40 mt-2">
          Your active conversations
        </p>

        {/* LOADING */}
        {loading && (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && conversations.length === 0 && (
          <div className="mt-10 text-center text-white/40">
            No conversations yet
          </div>
        )}

        {/* LIST */}
        {!loading && conversations.length > 0 && (
          <div className="mt-8 space-y-3">

            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() =>
                  router.push(`/messages/${conv.id}`)
                }
                className="
                  flex items-center gap-4
                  p-4 rounded-xl
                  bg-white/5 hover:bg-white/10
                  border border-white/10
                  cursor-pointer
                  transition
                "
              >

                {/* IMAGE */}
                <img
                  src={
                    conv.listing?.image ||
                    "/placeholder.png"
                  }
                  className="w-14 h-14 rounded-lg object-cover"
                />

                {/* CONTENT */}
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {conv.listing?.title || "Listing"}
                  </h3>

                  <p className="text-white/40 text-sm mt-1">
                    {conv.last_message || "Start a conversation"}
                  </p>
                </div>

                {/* TIME */}
                <div className="text-xs text-white/30">
                  {conv.last_message_at
                    ? new Date(
                        conv.last_message_at
                      ).toLocaleDateString()
                    : ""}
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </main>
  );
}