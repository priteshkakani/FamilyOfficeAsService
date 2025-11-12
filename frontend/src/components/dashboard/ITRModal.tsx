import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

export default function ITRModal({
  open,
  onClose,
  pan,
  year,
  loading,
  error,
  setPan,
  setYear,
  onSubmit,
}) {
  React.useEffect(() => {
    if (open) {
      console.log("[ITRModal Debug] ITRModal is rendering with open=true");
    }
  }, [open]);
  const [summary, setSummary] = useState(null);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      data-testid="itr-modal"
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          Connect ITR / AIS
        </h2>
        {!summary && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                PAN
              </label>
              <input
                className="w-full p-2 border rounded"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                placeholder="Enter PAN"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Assessment Year (optional)
              </label>
              <input
                className="w-full p-2 border rounded"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Enter Year (e.g. 2023)"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
                disabled={loading}
                data-testid="fetch-ais"
              >
                {loading ? "Fetching..." : "Fetch AIS"}
              </button>
            </div>
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </form>
        )}
        {summary && (
          <div className="text-green-700 font-semibold mb-2 text-center">
            ITR/AIS fetched successfully!
          </div>
        )}
        {summary && (
          <div className="bg-gray-100 p-3 rounded mt-2">
            <div>
              <b>PAN Name:</b> {summary.pan_name}
            </div>
            <div>
              <b>PAN Status:</b> {summary.pan_status}
            </div>
            <div>
              <b>Total Income:</b>{" "}
              {require("../../utils/formatINR").default(summary.total_income)}
            </div>
            <div>
              <b>Total Tax:</b>{" "}
              {require("../../utils/formatINR").default(summary.total_tax)}
            </div>
            <div>
              <b>Assessment Year:</b> {summary.assessment_year}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
