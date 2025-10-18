import React from "react";
import StatCurrency from "../StatCurrency";

export default function KpiCard({ title, value, subtitle, testid }) {
  const isNumber = typeof value === "number" && Number.isFinite(value);
  return (
    <div className="bg-white rounded-xl shadow-md p-5" data-testid={testid}>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 flex items-baseline justify-between">
        {isNumber ? (
          <StatCurrency value={value} />
        ) : (
          <div className="text-2xl font-semibold text-gray-800">{value}</div>
        )}
        {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
      </div>
    </div>
  );
}
