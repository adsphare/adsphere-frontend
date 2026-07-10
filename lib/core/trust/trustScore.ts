import { createServerSupabase } from "@/lib/supabase/server";


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

    const supabase =
      await createServerSupabase();


    const {
      data,
      error
    } =
      await supabase
        .from("profiles")
        .select("trust_score")
        .eq("id", userId)
        .single();


    if (error) {
      console.error(
        "TRUST GET ERROR:",
        error.message
      );

      return 50;
    }


    return data?.trust_score ?? 50;

  },



  /* =========================
     INIT USER
  ========================= */
  async init(userId: string) {

    const supabase =
      await createServerSupabase();


    await supabase
      .from("profiles")
      .update({

        trust_score: 50,

        last_active:
          new Date().toISOString(),

      })
      .eq("id", userId);

  },



  /* =========================
     INCREASE
  ========================= */
  async increase(
    userId: string,
    amount = 1
  ) {

    const current =
      await this.get(userId);


    const newScore =
      Math.min(
        100,
        current + amount
      );


    await this.save(
      userId,
      newScore
    );


    return newScore;

  },



  /* =========================
     DECREASE
  ========================= */
  async decrease(
    userId: string,
    amount = 5
  ) {

    const current =
      await this.get(userId);


    const newScore =
      Math.max(
        0,
        current - amount
      );


    await this.save(
      userId,
      newScore
    );


    return newScore;

  },



  /* =========================
     SAVE SCORE
  ========================= */
  async save(
    userId: string,
    score: number
  ) {

    const supabase =
      await createServerSupabase();


    await supabase
      .from("profiles")
      .update({

        trust_score: score,

        last_active:
          new Date().toISOString(),

      })
      .eq("id", userId);

  },



  /* =========================
     EVENT ENGINE
  ========================= */
  async applyEvent(
    userId: string,
    event: TrustEvent
  ) {

    switch(event) {


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
