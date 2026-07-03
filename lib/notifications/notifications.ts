import { createBrowserSupabase } from "@/lib/supabase/browser";
import { NotificationTypes } from "./types";

const supabase = createBrowserSupabase(); // ✅ THIS IS THE FIX

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
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      title,
      message,
      type,
      link,
      read: false,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("createNotification error:", error.message);
    return { success: false, error };
  }

  return { success: true, data };
}