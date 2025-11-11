import React from "react";

function KpiCard({ label, value, icon, loading, testid }) {
  return (
    <div
      className="flex flex-col items-center justify-center bg-white rounded-xl shadow p-4 min-w-[120px] min-h-[100px]"
      data-testid={testid}
    >
      {icon && <div className="mb-2">{icon}</div>}
      <div className="text-2xl font-bold mb-1">
        {loading ? (
          <span className="animate-pulse text-gray-400">...</span>
        ) : (
          value
        )}
      </div>
      <div className="text-xs text-gray-500 font-medium">{label}</div>
    </div>
  );
}

export default KpiCard;
