import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";
import ModalWrapper from "../ModalWrapper";

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

  const maskAccount = (acct) => {
    if (!acct) return "";
    const s = acct.toString();
    if (s.length <= 4) return `****${s}`;
    return `${s.slice(0, 2)}****${s.slice(-2)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.account_no || !form.ifsc || !form.consent) {
      notifyError("All fields and consent are required");
      return;
    }
    setSaving(true);
    try {
      const masked = maskAccount(form.account_no);
      const { error } = await supabase.from("bank_accounts").insert({
        user_id: userId,
        bank_name: form.bank_name,
        identifier: masked,
        connected: true,
        metadata: { ifsc: form.ifsc },
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      await supabase.from("consents").insert({
        user_id: userId,
        source: "BANK",
        identifier: masked,
        status: "approved",
        meta: { bank_name: form.bank_name, ifsc: form.ifsc },
      });
      notifySuccess("Bank account connected");
      onClose(true);
    } catch (e) {
      notifyError(`[BankModal][save] ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalWrapper open={open} onClose={onClose} ariaLabelledBy="modal-title" ariaDescribedBy="modal-desc-bank">
      <div className="flex justify-between items-center mb-2">
        <h2 id="modal-title" className="text-lg font-semibold" data-testid="modal-title">
          Connect Bank
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
      <p id="modal-desc-bank" className="text-sm text-gray-500">We store a masked account number and IFSC for read-only display; no credentials are stored.</p>
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
          <span className="text-sm">I consent to connect this bank account</span>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2.5 w-full"
          disabled={saving}
          data-testid="modal-submit"
        >
          {saving ? "Connecting..." : "Connect Bank"}
        </button>
      </form>
    </ModalWrapper>
  );
}
