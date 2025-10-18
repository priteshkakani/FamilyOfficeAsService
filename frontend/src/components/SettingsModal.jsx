import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { notifySuccess, notifyError } from "../utils/toast";

export default function SettingsModal({ open, onClose, profile }) {
  const [income, setIncome] = useState(profile?.monthly_income || 0);
  const [expenses, setExpenses] = useState(profile?.monthly_expenses || 0);
  useEffect(() => {
    setIncome(profile?.monthly_income || 0);
    setExpenses(profile?.monthly_expenses || 0);
  }, [profile]);

  const saveSettings = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ monthly_income: +income, monthly_expenses: +expenses })
      .eq("id", profile.id);
    if (!error) {
      notifySuccess("Settings updated");
      onClose();
    } else {
      notifyError(error.message || "Failed to update settings");
    }
  };

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="presentation"
    >
      <div
        className="bg-white rounded-xl p-6 w-96 space-y-4 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        data-testid="settings-modal"
      >
        <h2 id="settings-title" className="text-lg font-semibold text-gray-800">
          Settings
        </h2>
        <div>
          <label
            htmlFor="settings-monthly-income"
            className="text-sm text-gray-500"
          >
            Monthly Income
          </label>
          <input
            id="settings-monthly-income"
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label
            htmlFor="settings-monthly-expenses"
            className="text-sm text-gray-500"
          >
            Monthly Expenses
          </label>
          <input
            id="settings-monthly-expenses"
            type="number"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-gray-600 hover:text-gray-900"
            aria-label="close"
          >
            Cancel
          </button>
          <button
            onClick={saveSettings}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
