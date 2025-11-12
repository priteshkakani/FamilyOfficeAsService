import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
// import { useClient } from "../../hooks/useClientContext";
import { notifyError, notifySuccess } from "../../utils/toast";
import ModalWrapper from "../ModalWrapper";

const BROKERS = [
  "Zerodha",
  "Upstox",
  "ICICI Direct",
  "Angel One",
  "Groww",
  "HDFC Securities",
  "Other",
];

export default function StocksModal({ open, onClose, userId }) {
  const [form, setForm] = useState({
    broker: BROKERS[0],
    client_id: "",
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
    if (!form.client_id || !form.consent) {
      notifyError("Client ID and consent are required");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("data_sources").insert({
        user_id: userId,
        source: "STOCKS",
        identifier: form.client_id,
        connected: true,
        metadata: { broker: form.broker },
      });
      if (error) throw error;
      notifySuccess("Stock broker connected");
      onClose(true);
    } catch (e) {
      notifyError(`[StocksModal][save] ${e.message}`);
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
          Connect Stock Broker
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
          <label className="block mb-1 font-medium">Broker</label>
          <select
            name="broker"
            value={form.broker}
            onChange={handleInput}
            className="border border-gray-300 rounded-lg p-2.5 w-full"
          >
            {BROKERS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Client ID</label>
          <input
            name="client_id"
            type="text"
            value={form.client_id}
            onChange={handleInput}
            className="border border-gray-300 rounded-lg p-2.5 w-full"
            placeholder="Client ID"
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
          <span className="text-sm">I consent to connect this broker</span>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2.5 w-full"
          disabled={saving}
          data-testid="modal-submit"
        >
          {saving ? "Connecting..." : "Connect Broker"}
        </button>
      </form>
    </ModalWrapper>
  );
}
