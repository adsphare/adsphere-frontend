"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeNotifications } from "@/lib/core/notifications/realtime";
import type { Notification } from "@/lib/core/notifications/types";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const unsubscribeRef = useRef<null | (() => void)>(null);

  const unreadCount = items.filter((n) => !n.read).length;

  /* =========================
     INIT USER + LOAD DATA
  ========================= */
  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data } = await db.auth.getUser();
      const user = data?.user;

      if (!user || !mounted) return;

      setUserId(user.id);

      // initial load
      const { data: notifications, error } = await db
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Notification load error:", error.message);
        return;
      }

      if (mounted) {
        setItems((notifications as Notification[]) || []);
      }

      // realtime subscription
      unsubscribeRef.current = subscribeNotifications(
        user.id,
        (notif: Notification) => {
          if (!mounted) return;

          setItems((prev) => {
            const exists = prev.some((n) => n.id === notif.id);
            if (exists) return prev;

            return [notif, ...prev];
          });
        }
      );
    }

    init();

    return () => {
      mounted = false;
      unsubscribeRef.current?.();
    };
  }, []);

  /* =========================
     MARK SINGLE AS READ
  ========================= */
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

  /* =========================
     MARK ALL AS READ
  ========================= */
  async function markAllAsRead() {
    if (!userId) return;

    setItems((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );

    await db
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);
  }

  return (
    <div className="relative">

      {/* BELL */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative p-2 rounded-full hover:bg-white/10 transition"
      >
        🔔

        {/* BADGE */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-[#0b0f1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">

          {/* HEADER */}
          <div className="p-3 border-b border-white/10 flex justify-between items-center">
            <h2 className="font-semibold">Notifications</h2>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-400 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* LIST */}
          <div className="max-h-96 overflow-y-auto">

            {items.length === 0 && (
              <p className="p-4 text-white/50 text-sm">
                No notifications yet
              </p>
            )}

            {items.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition ${
                  !n.read ? "bg-white/5" : ""
                }`}
              >
                <p className="text-sm font-medium">{n.title}</p>

                <p className="text-xs text-white/60">
                  {n.message}
                </p>

                <p className="text-[10px] text-white/30 mt-1">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

