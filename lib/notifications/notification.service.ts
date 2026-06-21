import { createClient } from "@/lib/supabase/server";

export type NotificationType =
  | "campaign_created"
  | "campaign_activated"
  | "payment_received"
  | "boost_activated"
  | "booking_confirmed"
  | "delivery_submitted"
  | "review_received"
  | "system_alert";

type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
};

export const notificationService = {
  /* =========================
     CREATE NOTIFICATION
  ========================= */
  async create(input: CreateNotificationInput) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        metadata: input.metadata ?? {},
        read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  /* =========================
     MARK AS READ
  ========================= */
  async markAsRead(notificationId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("notifications")
      .update({
        read: true,
      })
      .eq("id", notificationId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  /* =========================
     GET USER NOTIFICATIONS
  ========================= */
  async getUserNotifications(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data || [];
  },
};