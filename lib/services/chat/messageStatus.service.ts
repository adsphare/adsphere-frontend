import { createBrowserSupabase } from "@/lib/supabase/browser";

const supabase = createBrowserSupabase();

/* =========================
   MESSAGE STATUS SERVICE
========================= */
export const messageStatusService = {
  async markDelivered(messageId: string) {
    const { error } = await supabase
      .from("messages")
      .update({
        status: "delivered",
        delivered_at: new Date().toISOString(),
      })
      .eq("id", messageId);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  },

  async markSeen(messageId: string) {
    const { error } = await supabase
      .from("messages")
      .update({
        status: "seen",
        seen_at: new Date().toISOString(),
      })
      .eq("id", messageId);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  },
};

