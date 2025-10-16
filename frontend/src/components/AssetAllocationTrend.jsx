import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function AssetAllocationTrend({ data, loading }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Asset Allocation Trend (6 Months)
      </h2>
      {loading ? (
        <div className="h-56 animate-pulse bg-gray-100 rounded" />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="assets"
              stroke="#22c55e"
              name="Assets"
            />
            <Line
              type="monotone"
              dataKey="liabilities"
              stroke="#ef4444"
              name="Liabilities"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
