import { TrustProfile } from "./types";


export function calculateTrust(
  profile: TrustProfile
): TrustProfile {

  let score = profile.score;

  const violations =
    profile.violations ?? 0;


  // penalty system
  score -= violations * 10;


  // keep score between 0-100
  score = Math.max(
    0,
    Math.min(100, score)
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

    ...profile,

    score,

    level,

  };

}
