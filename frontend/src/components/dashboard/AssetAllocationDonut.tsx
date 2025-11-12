import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AssetAllocationDonut({ data = [] }) {
  // normalize entries to { category, value }
  const normalized = (data || []).map((d) => ({
    category: d.category || d.name || d.label || "Other",
    value: Number(d.value || d.amount || d.share || 0),
  }));

  return (
    <div
      className="bg-white rounded-xl shadow-md p-4"
      data-testid="asset-allocation-donut"
    >
      <h3 className="text-lg font-semibold mb-3">Asset Allocation</h3>
      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={normalized}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              label
            >
              {normalized.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
