import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

export default function TermsConditions() {
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAccept = async () => {
    setSubmitting(true);
    setError("");
    try {
      const user = await supabase.auth.getUser();
      const userId = user?.data?.user?.id;
      if (!userId) throw new Error("No user session");
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({
          terms_accepted_at: new Date().toISOString(),
          is_onboarded: true,
        })
        .eq("id", userId);
      if (updateErr) throw updateErr;
      console.log("[Terms][accept]", { userId, accepted: true });
      window.location.href = "/dashboard";
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-5">
        <h2 className="text-xl font-bold mb-4 text-center">
          Terms & Conditions
        </h2>
        <div
          className="overflow-y-auto max-h-64 border p-3 rounded mb-4 text-sm text-gray-700"
          style={{ whiteSpace: "pre-line" }}
        >
          {/* Replace with actual T&C text */}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
          nunc ut laoreet dictum, enim erat cursus enim, nec dictum urna enim
          nec enim. Etiam euismod, nunc ut laoreet dictum, enim erat cursus
          enim, nec dictum urna enim nec enim.
        </div>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="accept"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            data-testid="terms-accept"
          />
          <label htmlFor="accept" className="text-sm">
            I accept the terms & conditions
          </label>
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="flex justify-end gap-3">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleAccept}
            disabled={!accepted || submitting}
            data-testid="terms-continue"
          >
            {submitting ? "Submitting..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
