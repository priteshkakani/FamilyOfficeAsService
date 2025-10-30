import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useClient } from "../../hooks/useClientContext";
import { notifyError, notifySuccess } from "../../utils/toast";
import ModalWrapper from "../ModalWrapper";

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
      // include auth token so backend can identify user
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch("/api/surepass/epfo/generate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ pan: form.uan, mobile: "" }),
      });
      const payload = await res.json();
      if (!res.ok) {
        // vendor or app-level error
        const msg =
          payload?.detail || payload?.message || "Failed to generate OTP";
        throw new Error(msg);
      }
      const txn =
        payload.transaction_id ||
        payload.transactionId ||
        (payload.raw && payload.raw.request_id) ||
        null;
      if (txn) {
        localStorage.setItem("epfo_transaction_id", txn);
      }
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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      const txn = localStorage.getItem("epfo_transaction_id");
      const res = await fetch("/api/surepass/epfo/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          transaction_id: txn || form.txn_id,
          otp: form.otp,
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        const msg =
          payload?.detail || payload?.message || "OTP verification failed";
        if (res.status === 424)
          notifyError("Vendor temporarily unavailable. Try again.");
        throw new Error(msg);
      }
      notifySuccess("OTP verified. Connected EPFO.");
      // Optionally save to Supabase client-side if backend didn't
      try {
        if (payload?.data) {
          await supabase.from("epfo_passbooks").insert({
            user_id: userId,
            uan: form.uan,
            snapshot: payload.data,
            fetched_at: new Date().toISOString(),
          });
        }
      } catch (e) {
        // non-fatal: backend already persisted
        console.warn("Failed to persist EPFO passbook client-side", e);
      }
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
    <ModalWrapper
      open={open}
      onClose={onClose}
      ariaLabelledBy="modal-title"
      ariaDescribedBy="modal-desc-epfo"
    >
      <div className="flex justify-between items-center mb-2">
        <h2
          id="modal-title"
          className="text-lg font-semibold"
          data-testid="modal-title"
        >
          Connect EPFO
        </h2>
        <button
          onClick={() => onClose(false)}
          className="text-gray-400 hover:text-gray-700 text-xl font-bold absolute right-4 top-4"
          aria-label="Close"
          data-testid="modal-close"
        >
          ✕
        </button>
      </div>
      <p id="modal-desc-epfo" className="text-sm text-gray-500">
        We use UAN + OTP to fetch your EPFO passbook snapshot with your consent;
        we store only the snapshot and consent record.
      </p>
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
            data-testid="modal-submit"
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
            data-testid="modal-submit"
          >
            {busy ? "Verifying..." : "Verify & Fetch Passbook"}
          </button>
        </form>
      )}
    </ModalWrapper>
  );
}
