"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/core/db";

type NotificationItem = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type?: string;
  read: boolean;
  created_at: string;
};

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    try {
      const { data: userData } = await db.auth.getUser();
      const user = userData?.user;

      if (!user) {
        setItems([]);
        return;
      }

      const { data, error } = await db
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setItems((data as NotificationItem[]) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    setItems((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );

    await db
      .from("notifications")
      .update({ read: true })
      .eq("id", id);
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">
        Notifications
      </h1>

      {loading && (
        <p className="text-white/60">Loading...</p>
      )}

      {!loading && items.length === 0 && (
        <p className="text-white/60">
          No notifications yet
        </p>
      )}

      <div className="space-y-3">
        {items.map((n) => (
          <div
            key={n.id}
            onClick={() => markAsRead(n.id)}
            className={`p-4 border border-white/10 rounded-xl cursor-pointer transition ${
              !n.read ? "bg-white/10" : "bg-white/5"
            }`}
          >
            <div className="font-semibold">
              {n.title}
            </div>

            <div className="text-sm text-white/60">
              {n.message}
            </div>

            <div className="text-xs text-white/40 mt-1">
              {new Date(n.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

