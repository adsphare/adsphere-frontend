"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getOrCreateConversation } from "@/lib/messaging/chats";

export default function ChatButton({ listing }: { listing: any }) {
  const router = useRouter();

  async function startChat() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const conversation = await getOrCreateConversation({
      listingId: listing.id,
      buyerId: user.id,
      ownerId: listing.owner_id,
    });

    router.push(`/messages/${conversation.id}`);
  }

  return (
    <button
      onClick={startChat}
      className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold"
    >
      💬 Message Owner
    </button>
  );
}