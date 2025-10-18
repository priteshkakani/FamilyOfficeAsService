import React from "react";

function fmt(n) {
  const num = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return `₹${num.toLocaleString("en-IN")}`;
}

export default function StatCurrency({ value = 0 }) {
  return <div className="text-2xl font-bold text-gray-800">{fmt(value)}</div>;
}
