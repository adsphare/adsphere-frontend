import { db } from "@/lib/core/db";

export const notification = {
  /* =========================
     CREATE NOTIFICATION
  ========================= */
  async create({
    userId,
    title,
    message,
    type = "system",
    data = {},
  }: {
    userId: string;
    title: string;
    message: string;
    type?: "chat" | "system" | "payment" | "listing";
    data?: any;
  }) {
    const { data: result, error } = await db
      .from("notifications")
      .insert({
        user_id: userId,
        title,
        message,
        type,
        data,
        read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return result;
  },

  /* =========================
     GET USER NOTIFICATIONS
  ========================= */
  async getUserNotifications(userId: string) {
    const { data, error } = await db
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  /* =========================
     MARK AS READ
  ========================= */
  async markAsRead(notificationId: string) {
    const { error } = await db
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) throw new Error(error.message);
  },

  /* =========================
     MARK ALL AS READ
  ========================= */
  async markAllAsRead(userId: string) {
    const { error } = await db
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (error) throw new Error(error.message);
  },
};

