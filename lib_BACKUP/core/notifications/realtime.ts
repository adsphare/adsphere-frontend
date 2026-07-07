import { db } from "@/lib/core/db";

export function subscribeNotifications(
  userId: string,
  callback: (notif: any) => void
) {
  const channel = db
    .channel(`notifications-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return () => {
    db.removeChannel(channel);
  };
}

