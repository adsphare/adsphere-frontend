import { createServerSupabase } from "@/lib/supabase/server";
import { NotificationTypes } from "@/lib/notifications/types";

type CreateNotificationInput = {
  userId: string;
  title: string;
  message: string;
  type: NotificationTypes;
  link?: string;
};

export async function createNotification({
  userId,
  title,
  message,
  type,
  link,
}: CreateNotificationInput) {
  try {
    const supabase = await createServerSupabase();

    const { error } = await supabase.from("notifications").insert({
      user_id: userId,
      title,
      message,
      type,
      link: link ?? null,
      read: false,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("❌ Notification insert failed:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("❌ Notification crash:", err.message);

    return {
      success: false,
      error: err.message || "Server error",
    };
  }
}






