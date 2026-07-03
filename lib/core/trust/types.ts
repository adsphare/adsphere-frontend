export type TrustLevel =
  | "NEW"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "VERIFIED";

export type TrustProfile = {
  userId: string;
  score: number; // 0 - 100
  level: TrustLevel;
  violations: number;
};