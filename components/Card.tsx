"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getOrCreateConversation } from "@/lib/messaging/chats";

export default function Card({ item }: { item: any }) {
  const router = useRouter();

  async function openChat() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return router.push("/login");

    const conv = await getOrCreateConversation({
      listingId: item.id,
      buyerId: user.id,
      ownerId: item.owner_id,
    });

    router.push(`/messages/${conv.id}`);
  }

  return (
    <div className="border border-white/10 rounded-xl p-4 bg-white/5">
      <h3>{item.title}</h3>
      <p>{item.location}</p>
      <p>${item.price}</p>

      <button
        onClick={openChat}
        className="mt-3 px-4 py-2 bg-blue-600 rounded"
      >
        Message
      </button>
    </div>
  );
}