import { TrustProfile } from "./types";

export function calculateTrust(profile: TrustProfile): TrustProfile {
  let { score, violations } = profile;

  // penalty system
  score -= violations * 10;

  if (score < 20) profile.level = "LOW";
  else if (score < 50) profile.level = "MEDIUM";
  else if (score < 80) profile.level = "HIGH";
  else profile.level = "VERIFIED";

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return {
    ...profile,
    score,
  };
}

