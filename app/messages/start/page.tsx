"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getOrCreateConversation } from "@/lib/messaging/chats";

export default function StartChatPage() {
  const router = useRouter();
  const params = useSearchParams();

  const listingId = params.get("listingId");
  const ownerId = params.get("ownerId");

  useEffect(() => {
    start();
  }, []);

  async function start() {
    if (!listingId || !ownerId) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const conversation = await getOrCreateConversation({
      listingId,
      buyerId: user.id,
      ownerId,
    });

    router.replace(`/messages/${conversation.id}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
      Creating chat...
    </div>
  );
}