import { createServerSupabase } from "@/lib/supabase/server";

export const trustScore = {
  async get(userId: string) {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("profiles")
      .select("trust_score")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("TRUST GET ERROR:", error.message);
      return 50;
    }

    return Math.max(
      0,
      Math.min(100, data?.trust_score ?? 50)
    );
  },
};
