"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

type ChartType = "line" | "bar";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  data: any[];
  dataKey: string;
  xKey: string;
  type?: ChartType;
  color?: string;
};

export default function ChartCard({
  title,
  subtitle,
  data,
  dataKey,
  xKey,
  type = "line",
  color = "#3b82f6",
}: ChartCardProps) {
  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4">
      
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && (
          <p className="text-sm text-white/40">{subtitle}</p>
        )}
      </div>

      {/* CHART */}
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">

          {type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey={xKey} stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey={xKey} stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          )}

        </ResponsiveContainer>
      </div>
    </div>
  );
}




