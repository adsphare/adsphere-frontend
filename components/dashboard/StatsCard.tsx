"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  title: string;
  data: any[];
  dataKey: string;
};

export default function ChartCard({ title, data, dataKey }: Props) {
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
      
      {/* TITLE */}
      <h2 className="text-white font-semibold mb-4">
        {title}
      </h2>

      {/* CHART */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}