import React, { useState } from "react";
import formatINR from "../../utils/formatINR";

export default function KpiCard({
  title,
  value,
  subtitle,
  testid,
  onSave,
  editable,
  kpiKey,
}) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [saving, setSaving] = useState(false);
  const isNumber = typeof value === "number" && Number.isFinite(value);
  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setInputValue(value);
  };
  const handleSave = async () => {
    if (!isNumber || inputValue < 0) return;
    setSaving(true);
    try {
      await onSave(inputValue);
      setEditing(false);
    } catch (e) {
      window.notifyError && window.notifyError("Failed to save");
      setInputValue(value);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div
      className="bg-white rounded-xl shadow-md p-5 relative group"
      data-testid={testid}
    >
      <div
        className="text-sm text-gray-500 cursor-pointer"
        onClick={editable ? handleEdit : undefined}
      >
        {title}
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        {editing ? (
          <input
            type="number"
            min={0}
            max={999999999}
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
            className="text-2xl font-semibold text-gray-800 border-b focus:outline-none w-24"
            data-testid={`kpi-input-${kpiKey}`}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            autoFocus
          />
        ) : isNumber ? (
          <div className="text-2xl font-semibold text-gray-800">
            {formatINR(value)}
            {editable && (
              <button
                className="ml-2 text-gray-400 hover:text-blue-600 focus:outline-none"
                onClick={handleEdit}
                data-testid={`kpi-edit-btn-${kpiKey}`}
                tabIndex={0}
                aria-label={`Edit ${title}`}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="text-2xl font-semibold text-gray-800">{value}</div>
        )}
        {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
      </div>
      {editing && (
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={handleSave}
            disabled={saving}
            data-testid={`kpi-save-${kpiKey}`}
          >
            Save
          </button>
          <button
            className="bg-gray-200 px-3 py-1 rounded"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
