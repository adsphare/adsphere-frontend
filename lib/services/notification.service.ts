import { createServerSupabase } from "@/lib/supabase/server";

export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "message"
  | "system"
  | "boost";

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  metadata?: Record<string, any>;
}

export const notificationService = {
  /* =========================
     CREATE NOTIFICATION
  ========================= */
  async create(input: CreateNotificationInput) {
    const supabase = createServerSupabase();

    const { error } = await supabase.from("notifications").insert({
      user_id: input.userId,
      title: input.title,
      message: input.message,
      type: input.type,
      link: input.link ?? null,
      metadata: input.metadata ?? {},
      read: false,
      created_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  },

  /* =========================
     GET USER NOTIFICATIONS
  ========================= */
  async getUserNotifications(userId: string) {
   const supabase = createServerSupabase();

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /* =========================
     MARK AS READ
  ========================= */
  async markAsRead(notificationId: string) {
  const supabase = createServerSupabase();

    const { data, error } = await supabase
      .from("notifications")
      .update({
        read: true,
      })
      .eq("id", notificationId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /* =========================
     MARK ALL AS READ
  ========================= */
  async markAllAsRead(userId: string) {
   const supabase = createServerSupabase();

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  },

  /* =========================
     DELETE NOTIFICATION
  ========================= */
  async delete(notificationId: string) {
const supabase = createServerSupabase();

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  },

  /* =========================
     SYSTEM NOTIFICATION HELPERS
  ========================= */
  async notifyBoostSuccess(userId: string, listingId: string) {
    return this.create({
      userId,
      title: "Boost Activated 🚀",
      message: "Your listing is now boosted and getting visibility.",
      type: "boost",
      link: `/marketplace/${listingId}`,
      metadata: { listingId },
    });
  },

  async notifyMessage(userId: string, senderName: string) {
    return this.create({
      userId,
      title: "New Message 💬",
      message: `${senderName} sent you a message`,
      type: "message",
      link: "/messages",
    });
  },

  async notifySystem(userId: string, message: string) {
    return this.create({
      userId,
      title: "System Update",
      message,
      type: "system",
    });
  },
};






