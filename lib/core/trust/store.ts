import { db } from "@/lib/core/db";
import { TrustProfile } from "./types";


export async function getTrust(
  userId: string
): Promise<TrustProfile | null> {

  const {
    data,
    error,
  } = await db
    .from("trust_scores")
    .select("*")
    .eq("user_id", userId)
    .single();


  if (error) {
    console.error(
      "GET TRUST ERROR:",
      error.message
    );

    return null;
  }


  return data;
}