export function calculateBoostPerformance(data: any[]) {
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