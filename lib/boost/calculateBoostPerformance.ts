export type BoostAnalyticsItem = {
  id: string;
  plan: string;
  impressions?: number;
  clicks?: number;
  views_generated?: number;
};

export type BoostPerformanceResult = {
  id: string;
  plan: string;
  impressions: number;
  clicks: number;
  ctr: number;
  conversion: number;
};

export function calculateBoostPerformance(
  data: BoostAnalyticsItem[]
): BoostPerformanceResult[] {
  return (data || []).map((item) => {
    const impressions = item.impressions || 0;
    const clicks = item.clicks || 0;
    const conversions = item.views_generated || 0;

    const ctr =
      impressions > 0 ? (clicks / impressions) * 100 : 0;

    const conversion =
      clicks > 0 ? (conversions / clicks) * 100 : 0;

    return {
      id: item.id,
      plan: item.plan,
      impressions,
      clicks,
      ctr: Number(ctr.toFixed(2)),
      conversion: Number(conversion.toFixed(2)),
    };
  });
}






