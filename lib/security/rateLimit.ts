import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

let ipLimiter: Ratelimit | null = null;
let txRefLimiter: Ratelimit | null = null;

function getLimiters() {
  if (!ipLimiter || !txRefLimiter) {
    const redis = Redis.fromEnv();

    ipLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      analytics: true,
      prefix: "adspheria:chapa:verify:ip",
    });

    txRefLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: true,
      prefix: "adspheria:chapa:verify:tx",
    });
  }

  return {
    ipLimiter,
    txRefLimiter,
  };
}

export async function checkChapaVerifyRateLimit(
  ip: string,
  txRef: string,
) {
  const { ipLimiter, txRefLimiter } = getLimiters();

  const [ipResult, txResult] = await Promise.all([
    ipLimiter.limit(ip),
    txRefLimiter.limit(txRef),
  ]);

  return {
    allowed: ipResult.success && txResult.success,
    ip: ipResult,
    txRef: txResult,
  };
}
