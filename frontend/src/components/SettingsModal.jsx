import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { notifySuccess, notifyError } from "../utils/toast";

export default function SettingsModal({
  open,
  onClose,
  profile,
  advisorSettings,
}) {
  const [fields, setFields] = useState({
    display_name: advisorSettings?.display_name || "",
    email: advisorSettings?.email || "",
    phone: advisorSettings?.phone || "",
    timezone: advisorSettings?.timezone || "Asia/Kolkata",
    currency: advisorSettings?.currency || "INR",
    theme: advisorSettings?.theme || "system",
    emergency_months: advisorSettings?.emergency_months || 6,
    di_ratio_limit: advisorSettings?.di_ratio_limit || 0.4,
    term_multiplier: advisorSettings?.term_multiplier || 10,
    health_cover_default: advisorSettings?.health_cover_default || 10,
    auto_refresh: advisorSettings?.auto_refresh || false,
    retention_months: advisorSettings?.retention_months || 24,
  });
  useEffect(() => {
    if (advisorSettings) {
      setFields({
        display_name: advisorSettings.display_name || "",
        email: advisorSettings.email || "",
        phone: advisorSettings.phone || "",
        timezone: advisorSettings.timezone || "Asia/Kolkata",
        currency: advisorSettings.currency || "INR",
        theme: advisorSettings.theme || "system",
        emergency_months: advisorSettings.emergency_months || 6,
        di_ratio_limit: advisorSettings.di_ratio_limit || 0.4,
        term_multiplier: advisorSettings.term_multiplier || 10,
        health_cover_default: advisorSettings.health_cover_default || 10,
        auto_refresh: advisorSettings.auto_refresh || false,
        retention_months: advisorSettings.retention_months || 24,
      });
    }
  }, [advisorSettings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFields((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const saveSettings = async () => {
    const payload = { ...fields, updated_at: new Date().toISOString() };
    const { error } = await supabase
      .from("advisor_settings")
      .upsert([payload], { onConflict: "advisor_id" });
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
        {/* Advisor Profile */}
        <div>
          <label className="text-sm text-gray-500">Display Name</label>
          <input
            name="display_name"
            type="text"
            value={fields.display_name}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Email</label>
          <input
            name="email"
            type="email"
            value={fields.email}
            readOnly
            className="w-full border rounded-lg p-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Phone</label>
          <input
            name="phone"
            type="text"
            value={fields.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Timezone</label>
          <input
            name="timezone"
            type="text"
            value={fields.timezone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Currency</label>
          <select
            name="currency"
            value={fields.currency}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-500">Theme</label>
          <select
            name="theme"
            value={fields.theme}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        {/* Recommendation Defaults */}
        <div>
          <label className="text-sm text-gray-500">Emergency Fund Months</label>
          <input
            name="emergency_months"
            type="number"
            value={fields.emergency_months}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">
            Max DI Ratio Threshold
          </label>
          <input
            name="di_ratio_limit"
            type="number"
            step="0.01"
            value={fields.di_ratio_limit}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">
            Term Insurance Multiplier
          </label>
          <input
            name="term_multiplier"
            type="number"
            value={fields.term_multiplier}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">
            Health Cover Default (₹ lakhs)
          </label>
          <input
            name="health_cover_default"
            type="number"
            value={fields.health_cover_default}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        {/* Data & Privacy */}
        <div>
          <label className="text-sm text-gray-500">
            Auto-refresh Feeds/Charts
          </label>
          <input
            name="auto_refresh"
            type="checkbox"
            checked={fields.auto_refresh}
            onChange={handleChange}
            className="ml-2"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">
            Data Retention (months)
          </label>
          <input
            name="retention_months"
            type="number"
            value={fields.retention_months}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-gray-600 hover:text-gray-900"
            aria-label="close"
            data-testid="settings-cancel"
          >
            Cancel
          </button>
          <button
            onClick={saveSettings}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg"
            data-testid="settings-save"
          >
            Save
          </button>
        </div>
        <div className="mt-2 flex justify-end">
          <button
            className="px-3 py-1 text-gray-700 border rounded"
            aria-label="Export data"
          >
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
}
