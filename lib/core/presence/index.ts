import { createServerSupabase } from "@/lib/supabase/server";

export const presence = {
  async setOnline(userId: string) {
    const db = await createServerSupabase();

    await db.from("user_presence").upsert({
      user_id: userId,
      status: "online",
      last_seen: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  },

  async setOffline(userId: string) {
    const db = await createServerSupabase();

    await db.from("user_presence").upsert({
      user_id: userId,
      status: "offline",
      last_seen: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  },

  async heartbeat(userId: string) {
    const db = await createServerSupabase();

    await db.from("user_presence").upsert({
      user_id: userId,
      status: "online",
      last_seen: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  },
};