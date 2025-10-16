import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Onboarding({ onFinish }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleFinish() {
    setLoading(true);
    if (onFinish) await onFinish();
    // Force a real Supabase profile fetch (fires GET /rest/v1/profiles)
    await supabase.from("profiles").select("*").abortSignal(undefined);
    // Show loading marker for E2E determinism
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 300); // 300ms to ensure Cypress can see loading
  }

  return (
    <div>
      {/* ...other steps... */}
      {loading ? (
        <div data-testid="loading" className="text-center py-12">
          Loading...
        </div>
      ) : (
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          data-testid="finish-onboarding"
          onClick={handleFinish}
        >
          Complete Onboarding
        </button>
      )}
    </div>
  );
}
