"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export default function NewMessageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserSupabase();

  const listingId = searchParams?.get("listing") ?? "";
  const sellerId = searchParams?.get("seller") ?? "";

  useEffect(() => {
    if (!listingId || !sellerId) return;

    init();
  }, [listingId, sellerId]);

  async function init() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const buyerId = user.id;

    const { data: existing } = await supabase
      .from("conversations")
      .select("*")
      .eq("listing_id", listingId)
      .eq("buyer_id", buyerId)
      .eq("seller_id", sellerId)
      .maybeSingle();

    if (existing) {
      router.push(`/messages/${existing.id}`);
      return;
    }

    const { data: created } = await supabase
      .from("conversations")
      .insert({
        listing_id: listingId,
        buyer_id: buyerId,
        seller_id: sellerId,
      })
      .select()
      .single();

    if (!created) {
      router.push("/marketplace");
      return;
    }

    router.push(`/messages/${created.id}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Starting chat...
    </div>
  );
}

