import { createBrowserSupabase } from "@/lib/supabase/browser";

export const clientNotifications = {
  async getUserNotifications(userId: string) {
    // ...
  },

  async getUnreadCount(userId: string) {
    // ...
  },

  async markAsRead(notificationId: string) {
    // ...
  },

  async markAllAsRead(userId: string) {
    // ...
  },

  subscribe(
    userId: string,
    callback: (payload: any) => void
  ) {
    // ...
  },
};