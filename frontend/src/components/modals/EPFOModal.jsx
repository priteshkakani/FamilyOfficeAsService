import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";

export default function EPFOModal({ open, onClose, userId }) {
  const [form, setForm] = useState({ uan: "", otp: "", consent: false });
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleGenerateOTP = async (e) => {
    e.preventDefault();
    if (!form.uan || !form.consent) {
      notifyError("UAN and consent are required");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/surepass/epfo/generate-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uan: form.uan }),
      });
      if (!res.ok) throw new Error("Failed to generate OTP");
      notifySuccess("OTP sent to your registered mobile");
      setStep(2);
    } catch (e) {
      notifyError(`[EPFOModal][otp] ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!form.otp) {
      notifyError("OTP is required");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/surepass/epfo/submit-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uan: form.uan, otp: form.otp }),
      });
      if (!res.ok) throw new Error("OTP verification failed");
      notifySuccess("OTP verified. Fetching passbook...");
      // Fetch passbook
      const passbookRes = await fetch("/surepass/epfo/passbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uan: form.uan }),
      });
      if (!passbookRes.ok) throw new Error("Failed to fetch passbook");
      const snapshot = await passbookRes.json();
      // Save to Supabase
      await supabase.from("epfo_passbooks").insert({
        user_id: userId,
        uan: form.uan,
        snapshot,
        fetched_at: new Date().toISOString(),
      });
      await supabase.from("consents").insert({
        user_id: userId,
        source: "EPFO",
        identifier: form.uan,
        status: "approved",
        meta: {},
      });
      notifySuccess("EPFO passbook connected");
      onClose(true);
    } catch (e) {
      notifyError(`[EPFOModal][verify] ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      aria-modal="true"
      tabIndex={-1}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 mx-4 relative">
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg font-semibold">Connect EPFO</div>
          <button
            onClick={() => onClose(false)}
            className="text-gray-400 hover:text-gray-700 text-xl font-bold absolute right-4 top-4"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {step === 1 ? (
          <form onSubmit={handleGenerateOTP} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">UAN</label>
              <input
                name="uan"
                type="text"
                value={form.uan}
                onChange={handleInput}
                className="border border-gray-300 rounded-lg p-2.5 w-full"
                placeholder="UAN (12 digits)"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                name="consent"
                type="checkbox"
                checked={form.consent}
                onChange={handleInput}
                className="form-checkbox"
              />
              <span className="text-sm">I consent to connect my EPFO</span>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2.5 w-full"
              disabled={busy}
            >
              {busy ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">OTP</label>
              <input
                name="otp"
                type="text"
                value={form.otp}
                onChange={handleInput}
                className="border border-gray-300 rounded-lg p-2.5 w-full"
                placeholder="Enter OTP"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2.5 w-full"
              disabled={busy}
            >
              {busy ? "Verifying..." : "Verify & Fetch Passbook"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
