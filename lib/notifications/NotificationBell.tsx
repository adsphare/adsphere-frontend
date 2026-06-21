"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  read: boolean;
};

export default function NotificationBell() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  /* =========================
     LOAD NOTIFICATIONS
  ========================= */
  useEffect(() => {
    load();

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function load() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    setNotifications(data || []);
  }

  /* =========================
     MARK AS READ
  ========================= */
  async function openNotification(n: Notification) {
    if (n.link) router.push(n.link);

    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", n.id);

    setOpen(false);
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      {/* BELL BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl bg-white/5 border border-white/10"
      >
        🔔

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-[#0b1020] border border-white/10 rounded-xl shadow-lg overflow-hidden">
          <div className="p-3 border-b border-white/10 font-semibold">
            Notifications
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="p-4 text-white/40 text-sm">
                No notifications
              </div>
            )}

            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => openNotification(n)}
                className={`p-3 cursor-pointer hover:bg-white/5 border-b border-white/10 ${
                  !n.read ? "bg-white/5" : ""
                }`}
              >
                <div className="font-semibold text-sm">{n.title}</div>
                <div className="text-xs text-white/60">{n.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}