import { createServerSupabase } from "@/lib/supabase/server";
import { NotificationTypes } from "@/lib/notifications/types";

/* =========================
   CREATE NOTIFICATION
========================= */
export async function createNotification({
  userId,
  title,
  message,
  type,
  link,
}: {
  userId: string;
  title: string;
  message: string;
  type: NotificationTypes;
  link?: string;
}) {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      title,
      message,
      type,
      link: link || null,
      read: false,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Notification error:", error);
    throw new Error(error.message);
  }

  return data;
}





