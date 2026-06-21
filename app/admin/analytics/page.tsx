import { createClient } from "@/lib/supabase/server";
import { calculateBoostPerformance } from "@/lib/analytics/boostAnalytics";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const { data } = await supabase.from("boost_analytics").select("*");

  const stats = calculateBoostPerformance(data || []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold">Ad Analytics 📊</h1>

      <div className="grid gap-4 mt-6">
        {stats.map((b) => (
          <div
            key={b.id}
            className="p-4 bg-white/5 border border-white/10 rounded-xl"
          >
            <div>Plan: {b.plan}</div>
            <div>Impressions: {b.impressions}</div>
            <div>Clicks: {b.clicks}</div>
            <div>CTR: {b.ctr}%</div>
            <div>Conversions: {b.conversions}</div>
            <div>CVR: {b.conversion}%</div>
            <div className="text-blue-400">
              Score: {b.performanceScore}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}