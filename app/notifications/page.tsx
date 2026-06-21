"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setItems(data || []);

    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id);
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      <div className="space-y-3">
        {items.map((n) => (
          <div
            key={n.id}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <h2 className="font-semibold">{n.title}</h2>
            <p className="text-white/60 text-sm">{n.message}</p>
          </div>
        ))}
      </div>
    </main>
  );
}