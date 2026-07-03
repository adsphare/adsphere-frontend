import { db } from "@/lib/core/db";

export type TrustEvent =
  | "message_sent"
  | "escrow_completed"
  | "dispute_won"
  | "dispute_lost"
  | "message_blocked"
  | "user_reported"
  | "listing_viewed";

export const trustScore = {

  /* =========================
     GET SCORE
  ========================= */
  async get(userId: string) {
    const { data } = await db
      .from("user_trust")
      .select("score")
      .eq("user_id", userId)
      .single();

    return data?.score ?? 50;
  },

  /* =========================
     INIT USER
  ========================= */
  async init(userId: string) {
    await db.from("user_trust").upsert({
      user_id: userId,
      score: 50,
      updated_at: new Date().toISOString(),
    });
  },

  /* =========================
     INCREASE
  ========================= */
  async increase(userId: string, amount = 1) {
    const current = await this.get(userId);
    const newScore = Math.min(100, current + amount);

    await db.from("user_trust").upsert({
      user_id: userId,
      score: newScore,
      updated_at: new Date().toISOString(),
    });

    return newScore;
  },

  /* =========================
     DECREASE
  ========================= */
  async decrease(userId: string, amount = 5) {
    const current = await this.get(userId);
    const newScore = Math.max(0, current - amount);

    await db.from("user_trust").upsert({
      user_id: userId,
      score: newScore,
      updated_at: new Date().toISOString(),
    });

    return newScore;
  },

  /* =========================
     EVENT ENGINE (SAFE)
  ========================= */
  async applyEvent(userId: string, event: TrustEvent) {
    switch (event) {

      case "message_sent":
        return this.increase(userId, 0.1);

      case "escrow_completed":
        return this.increase(userId, 5);

      case "dispute_won":
        return this.increase(userId, 3);

      case "dispute_lost":
        return this.decrease(userId, 10);

      case "message_blocked":
        return this.decrease(userId, 5);

      case "user_reported":
        return this.decrease(userId, 7);

      case "listing_viewed":
        return this.increase(userId, 0.05);

      default:
        return this.get(userId);
    }
  }
};