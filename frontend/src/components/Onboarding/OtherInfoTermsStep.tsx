import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../../layouts/OnboardingLayout";
import { supabase } from "../../supabaseClient";
import { notifySuccess, notifyError } from "../../utils/toast";

export default function OtherInfoTermsStep({ userId }) {
  const [otherInfo, setOtherInfo] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!accepted) return notifyError("You must accept the Terms & Conditions");
    setSaving(true);
    try {
      const payload = {
        id: userId,
        other_info: otherInfo,
        terms_accepted_at: new Date().toISOString(),
        is_onboarded: true,
      };
      const { error } = await supabase.from("profiles").upsert(payload);
      if (error) throw error;
      notifySuccess("Onboarding Complete!");
      navigate("/dashboard");
    } catch (err) {
      notifyError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 space-y-5">
        <OnboardingLayout title="Other Info & Terms">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="other-info"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Other Information
              </label>
              <textarea
                id="other-info"
                data-testid="other-info-textarea"
                value={otherInfo}
                onChange={(e) => setOtherInfo(e.target.value)}
                placeholder="Any additional notes or information..."
                className="border border-gray-300 rounded-lg w-full p-2.5 min-h-[100px]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="terms-checkbox"
                data-testid="terms-checkbox"
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="terms-checkbox" className="text-sm text-gray-700">
                I accept the Terms & Conditions
              </label>
            </div>
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                disabled={saving}
                data-testid="submit-other-info"
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-2.5"
              >
                {saving ? "Saving..." : "Complete Onboarding"}
              </button>
            </div>
          </div>
        </OnboardingLayout>
      </div>
    </div>
  );
}
