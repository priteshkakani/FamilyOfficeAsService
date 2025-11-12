import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
// import { useClient } from "../../hooks/useClientContext";
import { notifyError, notifySuccess } from "../../utils/toast";
import ModalWrapper from "../ModalWrapper";

const RTAS = ["CAMS", "KFintech"];

export default function MutualFundModal({ open, onClose, userId }) {
  const [form, setForm] = useState({
    rta: RTAS[0],
    pan: "",
    contact: "",
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
    if (!form.pan || !form.consent) {
      notifyError("PAN and consent are required");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("data_sources").insert({
        user_id: userId,
        source: "MF",
        identifier: form.pan,
        connected: true,
        metadata: { rta: form.rta, contact: form.contact },
      });
      if (error) throw error;
      notifySuccess("Mutual Fund connected");
      onClose(true);
    } catch (e) {
      notifyError(`[MutualFundModal][save] ${e.message}`);
    } finally {
      setSaving(false);
    }
  };
  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      ariaLabelledBy="modal-title"
      ariaDescribedBy="modal-desc-mf"
    >
      <div className="flex justify-between items-center mb-2">
        <h2
          id="modal-title"
          className="text-lg font-semibold"
          data-testid="modal-title"
        >
          Connect Mutual Fund
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
      <p id="modal-desc-mf" className="text-sm text-gray-500">
        We only store identifiers (PAN) and your consent. No credentials are
        stored.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">RTA</label>
          <select
            name="rta"
            value={form.rta}
            onChange={handleInput}
            className="border border-gray-300 rounded-lg p-2.5 w-full"
          >
            {RTAS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">PAN</label>
          <input
            name="pan"
            type="text"
            value={form.pan}
            onChange={handleInput}
            className="border border-gray-300 rounded-lg p-2.5 w-full"
            placeholder="PAN"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email or Phone</label>
          <input
            name="contact"
            type="text"
            value={form.contact}
            onChange={handleInput}
            className="border border-gray-300 rounded-lg p-2.5 w-full"
            placeholder="Email or Phone (optional)"
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
          <span className="text-sm">I consent to connect this mutual fund</span>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2.5 w-full"
          disabled={saving}
          data-testid="modal-submit"
        >
          {saving ? "Connecting..." : "Connect Mutual Fund"}
        </button>
      </form>
    </ModalWrapper>
  );
}
