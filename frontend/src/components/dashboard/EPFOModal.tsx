import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

export default function EPFOModal({ open, onClose, onSuccess }) {
  const [step, setStep] = useState(0);
  const [pan, setPan] = useState("");
  const [mobile, setMobile] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateOTP = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/surepass/epfo/generate-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pan, mobile }),
      });
      const data = await res.json();
      if (data.success) {
        setTransactionId(data.transaction_id);
        setStep(1);
      } else {
        setError(data.message || "Failed to generate OTP");
      }
    } catch (e) {
      setError("Error generating OTP");
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/surepass/epfo/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_id: transactionId, otp }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess && onSuccess(data.normalized);
        setStep(2);
      } else {
        setError(data.message || "Failed to verify OTP");
      }
    } catch (e) {
      setError("Error verifying OTP");
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Connect EPFO</h2>
        {step === 0 && (
          <>
            <label className="block mb-2">PAN</label>
            <input
              className="w-full mb-4 p-2 border rounded"
              value={pan}
              onChange={(e) => setPan(e.target.value)}
              placeholder="Enter PAN"
            />
            <label className="block mb-2">Mobile</label>
            <input
              className="w-full mb-4 p-2 border rounded"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter Mobile"
            />
            <button
              className="w-full bg-blue-600 text-white py-2 rounded"
              onClick={handleGenerateOTP}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate OTP"}
            </button>
          </>
        )}
        {step === 1 && (
          <>
            <label className="block mb-2">OTP</label>
            <input
              className="w-full mb-4 p-2 border rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <button
              className="w-full bg-green-600 text-white py-2 rounded"
              onClick={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
        {step === 2 && (
          <div className="text-green-700 font-semibold">
            EPFO Connected Successfully!
          </div>
        )}
        {error && <div className="text-red-600 mt-4">{error}</div>}
      </div>
    </div>
  );
}
