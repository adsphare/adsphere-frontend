"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewMessageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const listingId = searchParams?.get("listing")?.trim() ?? "";

  useEffect(() => {
    if (!listingId) {
      router.replace("/marketplace");
      return;
    }

    init();
  }, [listingId]);

  async function init() {
    try {
      const response = await fetch("/api/conversations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ listingId }),
      });

      const payload = await response.json().catch(() => null);

      if (response.status === 401) {
        router.replace("/auth/login");
        return;
      }

      if (!response.ok || !payload?.id) {
        router.replace("/marketplace");
        return;
      }

      router.replace(`/messages/${payload.id}`);
    } catch {
      router.replace("/marketplace");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Starting chat...
    </div>
  );
}
