"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Notification = {
  id: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const user = supabase.auth.getUser(); // safe fallback usage

  async function fetchNotifications() {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    setNotifications(data || []);
  }

  useEffect(() => {
    fetchNotifications();

    // REALTIME SUBSCRIPTION
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          setNotifications((prev) => [
            payload.new as Notification,
            ...prev,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function markAllAsRead() {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("read", false);

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    }
  }

  return (
    <div className="relative">

      {/* BELL BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="relative px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
      >
        🔔

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-[#0b1020] border border-white/10 rounded-xl shadow-xl z-50">

          {/* HEADER */}
          <div className="p-3 flex justify-between items-center border-b border-white/10">
            <h3 className="font-semibold">Notifications</h3>

            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Mark all read
            </button>
          </div>

          {/* LIST */}
          <div className="max-h-96 overflow-y-auto">

            {notifications.length === 0 && (
              <p className="p-4 text-white/40 text-sm">
                No notifications yet
              </p>
            )}

            {notifications.map((n) => (
              <Link
                key={n.id}
                href={n.link || "#"}
                className={`block p-3 border-b border-white/10 hover:bg-white/5 transition ${
                  !n.read ? "bg-white/5" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-white/40">{n.message}</p>
              </Link>
            ))}

          </div>
        </div>
      )}
    </div>
  );
}