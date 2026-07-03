"use client";

import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { useState } from "react";

type CreateCampaignButtonProps = {
  listingId: string;
};

export default function CreateCampaignButton({
  listingId,
}: CreateCampaignButtonProps) {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      router.push(`/campaigns/create?listing=${listingId}`);
    } catch (err) {
      console.error("Create campaign error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="
        px-4 py-2
        rounded-lg
        bg-blue-600
        hover:bg-blue-700
        text-white
        font-medium
        transition
        disabled:opacity-50
      "
    >
      {loading ? "Loading..." : "Create Campaign"}
    </button>
  );
}