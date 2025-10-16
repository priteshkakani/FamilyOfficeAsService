import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";

const BANKS = [
  "HDFC Bank",
  "ICICI Bank",
  "SBI",
  "Axis Bank",
  "Kotak Mahindra",
  "IDFC First",
  "Yes Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Other",
];

export default function BankModal({ open, onClose, userId }) {
  const [form, setForm] = useState({
    bank_name: BANKS[0],
    account_no: "",
    ifsc: "",
    consent: false,
  });
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.account_no || !form.ifsc || !form.consent) {
      notifyError("All fields and consent are required");
      return;
    }
    setSaving(true);
    try {
      const masked = form.account_no.replace(/.(?=.{4})/g, "*");
      const { error } = await supabase.from("data_sources").insert({
        user_id: userId,
        source: "BANK",
        identifier: masked,
        connected: true,
        metadata: { bank_name: form.bank_name, ifsc: form.ifsc },
      });
      if (error) throw error;
      notifySuccess("Bank account connected");
      onClose(true);
    } catch (e) {
      notifyError(`[BankModal][save] ${e.message}`);
    } finally {
      setSaving(false);
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
          <div className="text-lg font-semibold">Connect Bank</div>
          <button
            onClick={() => onClose(false)}
            className="text-gray-400 hover:text-gray-700 text-xl font-bold absolute right-4 top-4"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Bank Name</label>
            <select
              name="bank_name"
              value={form.bank_name}
              onChange={handleInput}
              className="border border-gray-300 rounded-lg p-2.5 w-full"
            >
              {BANKS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Account Number</label>
            <input
              name="account_no"
              type="text"
              value={form.account_no}
              onChange={handleInput}
              className="border border-gray-300 rounded-lg p-2.5 w-full"
              placeholder="Account Number"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">IFSC</label>
            <input
              name="ifsc"
              type="text"
              value={form.ifsc}
              onChange={handleInput}
              className="border border-gray-300 rounded-lg p-2.5 w-full"
              placeholder="IFSC Code"
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
            <span className="text-sm">
              I consent to connect this bank account
            </span>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2.5 w-full"
            disabled={saving}
          >
            {saving ? "Connecting..." : "Connect Bank"}
          </button>
        </form>
      </div>
    </div>
  );
}
