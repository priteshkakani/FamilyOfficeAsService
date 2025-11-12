import React, { useEffect, useState } from "react";
import supabase from "../../supabaseClient";

export default function SettingsModal({ onClose }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    advisor_firm: "",
    preferences: "",
    timezone: "Asia/Kolkata",
    currency: "INR",
    theme: "system",
    emergency_months: 6,
    di_ratio_limit: 0.4,
    term_multiplier: 10,
    health_cover_default: 5,
    auto_refresh: true,
    retention_months: 24,
  });

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      setLoading(true);
      setError("");
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) {
        setError("Not logged in");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("advisor_settings")
        .select(
          "full_name,email,phone,advisor_firm,preferences,timezone,currency,theme,emergency_months,di_ratio_limit,term_multiplier,health_cover_default,auto_refresh,retention_months"
        )
        .eq("id", userId)
        .maybeSingle();
      if (mounted) {
        if (error) setError(error.message);
        else if (data) setProfile(data);
        setLoading(false);
      }
    }
    fetchProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) {
      setError("Not logged in");
      setSaving(false);
      return;
    }
    const { error: upsertError } = await supabase
      .from("advisor_settings")
      .upsert({
        id: userId,
        advisor_id: userId,
        ...profile,
        updated_at: new Date().toISOString(),
      });
    if (upsertError) setError(upsertError.message);
    setSaving(false);
    if (!upsertError) onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      data-testid="settings-modal"
    >
      <div className="bg-black/30 absolute inset-0" onClick={onClose} />
      <div className="bg-white rounded-xl shadow p-6 z-10 w-full max-w-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold" id="settings-title">
            Advisor Settings
          </h3>
          <button
            onClick={onClose}
            aria-label="close"
            className="ml-2 px-2 py-1 rounded hover:bg-gray-100"
            data-testid="settings-close-btn"
          >
            ✕
          </button>
        </div>
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={handleSave}
            aria-labelledby="settings-title"
          >
            {/* Advisor Profile */}
            <div>
              <label
                htmlFor="settings-full-name"
                className="block text-sm font-medium text-gray-700"
              >
                Display Name
              </label>
              <input
                id="settings-full-name"
                name="full_name"
                type="text"
                value={profile.full_name || ""}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                required
                data-testid="settings-full-name"
              />
            </div>
            <div>
              <label
                htmlFor="settings-email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="settings-email"
                name="email"
                type="email"
                value={profile.email || ""}
                className="mt-1 block w-full border rounded px-3 py-2 bg-gray-100"
                readOnly
                data-testid="settings-email"
              />
            </div>
            <div>
              <label
                htmlFor="settings-phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                id="settings-phone"
                name="phone"
                type="tel"
                value={profile.phone || ""}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                pattern="[0-9]{10}"
                required
                data-testid="settings-phone"
              />
            </div>
            <div>
              <label
                htmlFor="settings-timezone"
                className="block text-sm font-medium text-gray-700"
              >
                Timezone
              </label>
              <select
                id="settings-timezone"
                name="timezone"
                value={profile.timezone}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                data-testid="settings-timezone"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Asia/Dubai">Asia/Dubai</option>
                <option value="Asia/Singapore">Asia/Singapore</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="settings-currency"
                className="block text-sm font-medium text-gray-700"
              >
                Currency
              </label>
              <select
                id="settings-currency"
                name="currency"
                value={profile.currency}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                data-testid="settings-currency"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="settings-theme"
                className="block text-sm font-medium text-gray-700"
              >
                Theme
              </label>
              <select
                id="settings-theme"
                name="theme"
                value={profile.theme}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                data-testid="settings-theme"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="settings-advisor-firm"
                className="block text-sm font-medium text-gray-700"
              >
                Firm/Company
              </label>
              <input
                id="settings-advisor-firm"
                name="advisor_firm"
                type="text"
                value={profile.advisor_firm || ""}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                data-testid="settings-advisor-firm"
              />
            </div>
            {/* Defaults for Recommendations */}
            <div className="pt-2 border-t">
              <label className="block text-sm font-medium text-gray-700">
                Emergency Fund (months)
              </label>
              <input
                id="settings-emergency-months"
                name="emergency_months"
                type="number"
                min={1}
                max={24}
                value={profile.emergency_months}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                data-testid="settings-emergency-months"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max DI Ratio Threshold
              </label>
              <input
                id="settings-di-ratio"
                name="di_ratio_limit"
                type="number"
                step="0.01"
                min={0}
                max={1}
                value={profile.di_ratio_limit}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                data-testid="settings-di-ratio"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Term Insurance Multiplier (× income)
              </label>
              <input
                id="settings-term-multiplier"
                name="term_multiplier"
                type="number"
                min={1}
                max={30}
                value={profile.term_multiplier}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                data-testid="settings-term-multiplier"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Health Cover Default (₹ lakhs)
              </label>
              <input
                id="settings-health-cover"
                name="health_cover_default"
                type="number"
                min={1}
                max={100}
                value={profile.health_cover_default}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                data-testid="settings-health-cover"
              />
            </div>
            {/* Data & Privacy */}
            <div className="pt-2 border-t">
              <label className="block text-sm font-medium text-gray-700">
                Auto-refresh Feeds & Charts
              </label>
              <input
                id="settings-auto-refresh"
                name="auto_refresh"
                type="checkbox"
                checked={!!profile.auto_refresh}
                onChange={(e) =>
                  handleChange({
                    target: { name: "auto_refresh", value: e.target.checked },
                  })
                }
                className="ml-2"
                data-testid="settings-auto-refresh"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data Retention (months)
              </label>
              <input
                id="settings-retention"
                name="retention_months"
                type="number"
                min={1}
                max={120}
                value={profile.retention_months}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                data-testid="settings-retention"
              />
            </div>
            <div>
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                data-testid="settings-export"
              >
                Export Data
              </button>
            </div>
            {error && (
              <div
                className="text-red-600 text-sm"
                data-testid="settings-error"
              >
                {error}
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                data-testid="settings-cancel-btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 focus:ring focus:ring-blue-200"
                data-testid="settings-save-btn"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
