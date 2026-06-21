type AnalyticsInput = {
  impressions: number;
  clicks: number;
  conversions: number;
};

export function calculateCTR(clicks: number, impressions: number) {
  if (!impressions) return 0;
  return Number(((clicks / impressions) * 100).toFixed(2));
}

export function calculateCVR(conversions: number, clicks: number) {
  if (!clicks) return 0;
  return Number(((conversions / clicks) * 100).toFixed(2));
}

/* =========================
   FULL STATS ENGINE
========================= */
export function calculateBoostPerformance(items: any[]) {
  return items.map((b) => {
    const ctr = calculateCTR(b.clicks, b.impressions);
    const conversion = calculateCVR(b.conversions, b.clicks);

    // 🔥 Ad ranking score (Meta-style simplified)
    const performanceScore =
      b.impressions * 0.1 +
      b.clicks * 2 +
      b.conversions * 5;

    return {
      ...b,
      ctr,
      conversion,
      performanceScore,
    };
  });
}