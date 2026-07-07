import { TrustProfile } from "./types";

export async function getTrust(userId: string): Promise<TrustProfile> {
  const { data } = await db
    .from("trust_scores")
    .select("*")
    .eq("user_id", userId)
    .single();

  return data;
}

