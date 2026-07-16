import { createBrowserSupabase } from "@/lib/supabase/browser";

type NotificationPayload = {
  eventType?: string;
  new?: unknown;
  old?: unknown;
};

export const clientNotifications = {
  async getUserNotifications(userId: string) {
    const supabase = createBrowserSupabase();

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  },


  async getUnreadCount(userId: string) {
    const supabase = createBrowserSupabase();

    const { count, error } = await supabase
      .from("notifications")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("user_id", userId)
      .eq("read", false);

    if (error) {
      throw new Error(error.message);
    }

    return count ?? 0;
  },


  async markAsRead(notificationId: string) {
    const supabase = createBrowserSupabase();

    const { error } = await supabase
      .from("notifications")
      .update({
        read: true,
      })
      .eq("id", notificationId);

    if (error) {
      throw new Error(error.message);
    }
  },


  async markAllAsRead(userId: string) {
    const supabase = createBrowserSupabase();

    const { error } = await supabase
      .from("notifications")
      .update({
        read: true,
      })
      .eq("user_id", userId)
      .eq("read", false);

    if (error) {
      throw new Error(error.message);
    }
  },


  subscribe(
    userId: string,
    callback: (payload: NotificationPayload) => void
  ) {
    const supabase = createBrowserSupabase();

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();


    return () => {
      supabase.removeChannel(channel);
    };
  },
};