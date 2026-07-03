"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  read: boolean;
  created_at?: string;
};

export default function NotificationBell() {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let channel: any;

    const init = async () => {
      await load();

      channel = supabase
        .channel("notifications-realtime")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
          },
          (payload: any) => {
            setNotifications((prev) => [
              payload.new as Notification,
              ...prev,
            ]);
          }
        )
        .subscribe();
    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  async function load() {
    const { data } = await supabase.auth.getUser();

    const user = data?.user;
    if (!user) return;

    const { data: rows } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    setNotifications((rows as Notification[]) || []);
  }

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

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-[#0b1020] border border-white/10 rounded-xl">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => openNotification(n)}
              className="p-3 border-b border-white/10 hover:bg-white/5 cursor-pointer"
            >
              <div className="font-semibold text-sm">{n.title}</div>
              <div className="text-xs text-white/60">{n.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}