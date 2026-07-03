import { createServerSupabase } from "@/lib/supabase/server";
import { calculateBoostPerformance } from "@/lib/boost/calculateBoostPerformance";

export default async function Page() {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("boost_analytics")
    .select("*");

  if (error) {
    console.error("Analytics error:", error);

    return (
      <main className="p-10 text-white bg-[#050816] min-h-screen">
        <h1 className="text-2xl font-bold">Boost Analytics 📊</h1>

        <p className="text-red-400 mt-4">
          Failed to load analytics
        </p>
      </main>
    );
  }

  const analytics = calculateBoostPerformance(data || []);

  return (
    <main className="p-10 text-white bg-[#050816] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Boost Analytics 📊
      </h1>

      {analytics.length === 0 ? (
        <p className="text-white/40">
          No analytics data found
        </p>
      ) : (
        <div className="space-y-3">
          {analytics.map((item) => (
            <div
              key={item.id}
              className="border border-white/10 p-4 rounded-lg bg-white/5"
            >
              <p className="font-semibold">
                Plan:{" "}
                <span className="text-blue-400">
                  {item.plan}
                </span>
              </p>

              <p className="text-white/70">
                👁 Impressions: {item.impressions}
              </p>

              <p className="text-white/70">
                👆 Clicks: {item.clicks}
              </p>

              <p className="text-green-400">
                CTR: {item.ctr}%
              </p>

              <p className="text-yellow-400">
                Conversion: {item.conversion}%
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}





