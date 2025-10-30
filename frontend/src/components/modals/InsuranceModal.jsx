import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useClient } from "../../hooks/useClientContext";
import { notifyError, notifySuccess } from "../../utils/toast";
import ModalWrapper from "../ModalWrapper";

const PROVIDERS = [
  "LIC",
  "HDFC Life",
  "ICICI Prudential",
  "SBI Life",
  "Max Life",
  "Bajaj Allianz",
  "Other",
];
const POLICY_TYPES = ["Health", "Motor", "Life"];

export default function InsuranceModal({ open, onClose, userId }) {
  const [form, setForm] = useState({
    provider: PROVIDERS[0],
    policy_type: POLICY_TYPES[0],
    policy_no: "",
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
    if (!form.policy_no || !form.consent) {
      notifyError("Policy No and consent are required");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("data_sources").insert({
        user_id: userId,
        source: "INSURANCE",
        identifier: form.policy_no,
        connected: true,
        metadata: { provider: form.provider, policy_type: form.policy_type },
      });
      if (error) throw error;
      notifySuccess("Insurance policy connected");
      onClose(true);
    } catch (e) {
      notifyError(`[InsuranceModal][save] ${e.message}`);
    } finally {
      setSaving(false);
    }
  };
  return (
    <ModalWrapper open={open} onClose={onClose} ariaLabelledBy="modal-title">
      <div className="flex justify-between items-center mb-2">
        <h2
          id="modal-title"
          className="text-lg font-semibold"
          data-testid="modal-title"
        >
          Connect Insurance
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Provider</label>
          <select
            name="provider"
            value={form.provider}
            onChange={handleInput}
            className="border border-gray-300 rounded-lg p-2.5 w-full"
          >
            {PROVIDERS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Policy Type</label>
          <select
            name="policy_type"
            value={form.policy_type}
            onChange={handleInput}
            className="border border-gray-300 rounded-lg p-2.5 w-full"
          >
            {POLICY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Policy Number</label>
          <input
            name="policy_no"
            type="text"
            value={form.policy_no}
            onChange={handleInput}
            className="border border-gray-300 rounded-lg p-2.5 w-full"
            placeholder="Policy Number"
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
            I consent to connect this insurance policy
          </span>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2.5 w-full"
          disabled={saving}
          data-testid="modal-submit"
        >
          {saving ? "Connecting..." : "Connect Insurance"}
        </button>
      </form>
    </ModalWrapper>
  );
}
