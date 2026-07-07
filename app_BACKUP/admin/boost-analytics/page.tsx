import { createServerSupabase } from "@/lib/supabase/server";

type BoostAnalytics = {
  id: string;
  plan: string;
  impressions: number;
  clicks: number;
  views_generated: number;
};

export default async function Page() {
  const supabase = createServerSupabase();

  const { data } = await supabase
    .from("boost_analytics")
    .select("*");

  const analytics = (data || []).map((item: BoostAnalytics) => ({
    id: item.id,
    plan: item.plan,
    impressions: item.impressions || 0,
    clicks: item.clicks || 0,

    ctr:
      item.impressions > 0
        ? (item.clicks / item.impressions) * 100
        : 0,

    conversion:
      item.clicks > 0
        ? (item.views_generated / item.clicks) * 100
        : 0,
  }));

  return (
    <main className="p-10 text-white">
      <h1 className="text-2xl font-bold mb-6">
        Boost Analytics
      </h1>

      <div className="space-y-3">
        {analytics.map((a) => (
          <div key={a.id} className="border p-3 border-white/10">
            <p>Plan: {a.plan}</p>
            <p>CTR: {a.ctr.toFixed(2)}%</p>
            <p>Conversion: {a.conversion.toFixed(2)}%</p>
          </div>
        ))}
      </div>
    </main>
  );
}

