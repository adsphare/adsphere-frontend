import { db } from "@/lib/core/db";

export const presence = {
  /* =========================
     UPDATE LAST SEEN
  ========================= */
  async updatePresence(userId: string) {
    const { error } = await db
      .from("profiles")
      .update({
        last_seen_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw new Error(error.message);
  },

  /* =========================
     GET USER STATUS
  ========================= */
  async getStatus(userId: string) {
    const { data, error } = await db
      .from("profiles")
      .select("last_seen_at")
      .eq("id", userId)
      .single();

    if (error) throw new Error(error.message);

    if (!data?.last_seen_at) {
      return { online: false, lastSeen: null };
    }

    const lastSeen = new Date(data.last_seen_at);
    const now = new Date();

    const diffMinutes =
      (now.getTime() - lastSeen.getTime()) / (1000 * 60);

    return {
      online: diffMinutes < 2, // 🔥 online threshold = 2 min
      lastSeen: data.last_seen_at,
    };
  },
};

