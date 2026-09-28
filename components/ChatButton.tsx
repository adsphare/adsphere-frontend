"use client";

import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { getOrCreateConversation } from "@/lib/messaging/getOrCreateConversation";

export default function ChatButton({ listing }: { listing: any }) {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  async function startChat() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (!listing?.id) {
      console.error("Invalid listing data");
      return;
    }

    try {
      const conversation = await getOrCreateConversation({
        listingId: listing.id,
      });

      router.push(`/messages/${conversation.id}`);
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  }

  return (
    <button
      onClick={startChat}
      className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold"
    >
      ?? Message Owner
    </button>
  );
}
