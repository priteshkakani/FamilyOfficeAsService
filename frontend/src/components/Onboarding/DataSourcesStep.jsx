import React from "react";

const SOURCES = [
  { key: "bank", label: "Bank" },
  { key: "mutual_funds", label: "Mutual Funds" },
  { key: "stocks", label: "Stocks" },
  { key: "insurance", label: "Insurance" },
  { key: "epfo", label: "EPFO" },
  { key: "itr", label: "ITR" },
];

export default function DataSourcesStep({ data, onChange }) {
  const selected = data.data_sources || [];
  const handleToggle = (key) => {
    if (selected.includes(key)) {
      onChange({ ...data, data_sources: selected.filter((k) => k !== key) });
    } else {
      onChange({ ...data, data_sources: [...selected, key] });
    }
  };
  return (
    <div>
      <div className="mb-2 font-medium">Select data sources to connect:</div>
      <div className="flex flex-wrap gap-4">
        {SOURCES.map((src) => (
          <label key={src.key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(src.key)}
              onChange={() => handleToggle(src.key)}
              className="checkbox"
            />
            {src.label}
          </label>
        ))}
      </div>
    </div>
  );
}
