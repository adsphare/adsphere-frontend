export function calculateBoostPerformance(rows: any[]) {
  return rows.map((r) => {
    const ctr =
      r.impressions > 0 ? (r.clicks / r.impressions) * 100 : 0;

    const conversionRate =
      r.clicks > 0 ? (r.conversions / r.clicks) * 100 : 0;

    return {
      ...r,
      ctr: Number(ctr.toFixed(2)),
      conversionRate: Number(conversionRate.toFixed(2)),
    };
  });
}