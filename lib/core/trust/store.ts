import { db } from "@/lib/core/db";
import { TrustProfile } from "./types";

export async function getTrust(
  userId: string
): Promise<TrustProfile | null> {

  const {
    data,
    error,
  } =
    await db
      .from("profiles")
      .select("id, trust_score")
      .eq("id", userId)
      .single();

  if (error) {
    console.error(
      "GET TRUST ERROR:",
      error.message
    );

    return null;
  }

  if (!data) {
    return null;
  }

  const score =
    Math.max(
      0,
      Math.min(
        100,
        data.trust_score ?? 0
      )
    );

  let level:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "VERIFIED";

  if (score < 20) {
    level = "LOW";
  } else if (score < 50) {
    level = "MEDIUM";
  } else if (score < 80) {
    level = "HIGH";
  } else {
    level = "VERIFIED";
  }

  return {
    userId: data.id,
    score,
    level,
    violations: 0,
  };
}
