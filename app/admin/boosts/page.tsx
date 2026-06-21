"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function BoostActions({ boostId }: { boostId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function run(action: "activate" | "expire") {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/boosts/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boostId, action }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed");
      }

      // 🔥 Better than reload
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={loading}
        onClick={() => run("activate")}
        className="px-3 py-1 bg-green-500 text-black rounded"
      >
        Activate
      </button>

      <button
        disabled={loading}
        onClick={() => run("expire")}
        className="px-3 py-1 bg-red-500 text-black rounded"
      >
        Expire
      </button>
    </div>
  );
}
