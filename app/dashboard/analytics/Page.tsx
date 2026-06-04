import {
  TrendingUp,
  DollarSign,
  Eye,
  MousePointerClick,
} from "lucide-react";

export default function AnalyticsPage() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$24,580",
      icon: DollarSign,
      change: "+12.5%",
    },
    {
      title: "Ad Views",
      value: "1.2M",
      icon: Eye,
      change: "+18.2%",
    },
    {
      title: "Clicks",
      value: "48,320",
      icon: MousePointerClick,
      change: "+9.1%",
    },
    {
      title: "Growth",
      value: "32%",
      icon: TrendingUp,
      change: "+4.3%",
    },
  ];

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-white/60 mt-2">
          Track your campaigns, growth, and platform performance.
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/[0.07] transition"
          >

            <div className="flex items-center justify-between mb-4">
              <div className="text-white/60 text-sm">
                {stat.title}
              </div>

              <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
                <stat.icon size={20} />
              </div>
            </div>

            <div className="text-3xl font-bold mb-2">
              {stat.value}
            </div>

            <div className="text-green-400 text-sm">
              {stat.change} this month
            </div>

          </div>
        ))}

      </div>

      {/* CHART PLACEHOLDER */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[350px]">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              Performance Overview
            </h2>

            <p className="text-white/50 text-sm mt-1">
              Campaign engagement over time
            </p>
          </div>

          <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition text-sm">
            Export Report
          </button>
        </div>

        {/* FAKE CHART */}
        <div className="h-[250px] rounded-xl border border-dashed border-white/10 flex items-center justify-center text-white/40">
          Analytics chart coming soon
        </div>

      </div>

      {/* RECENT CAMPAIGNS */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            Recent Campaigns
          </h2>

          <button className="text-sm text-blue-400 hover:text-blue-300 transition">
            View all
          </button>
        </div>

        <div className="space-y-4">

          {[
            {
              name: "Summer Promotion",
              status: "Active",
              impressions: "420K",
            },
            {
              name: "Creator Partnership",
              status: "Paused",
              impressions: "190K",
            },
            {
              name: "Marketplace Launch",
              status: "Completed",
              impressions: "870K",
            },
          ].map((campaign) => (
            <div
              key={campaign.name}
              className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5"
            >

              <div>
                <h3 className="font-medium">
                  {campaign.name}
                </h3>

                <p className="text-sm text-white/50 mt-1">
                  {campaign.impressions} impressions
                </p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  campaign.status === "Active"
                    ? "bg-green-500/20 text-green-400"
                    : campaign.status === "Paused"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {campaign.status}
              </span>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}
