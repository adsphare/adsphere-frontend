import { supabase } from "@/lib/supabase";
import { NotificationTypes } from "./types";

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
  return await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
    link,
    read: false,
    created_at: new Date().toISOString(),
  });
}