import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";
import ModalWrapper from "../ModalWrapper";

export default function ITRModal({ open, onClose, userId }) {
  const [form, setForm] = useState({ pan: "", year: "", consent: false });
  const [busy, setBusy] = useState(false);
  if (!open) return null;
  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };
  const handleFetchAIS = async (e) => {
    e.preventDefault();
    if (!form.pan || !form.consent) {
      notifyError("PAN and consent are required");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/surepass/itr/ais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pan: form.pan, year: form.year }),
      });
      if (!res.ok) throw new Error("Failed to fetch AIS");
      const ais = await res.json();
      await supabase.from("itr_ais").insert({
        user_id: userId,
        pan: form.pan,
        year: form.year || null,
        ais,
        fetched_at: new Date().toISOString(),
      });
      await supabase.from("consents").insert({
        user_id: userId,
        source: "ITR",
        identifier: form.pan,
        status: "approved",
        meta: {},
      });
      notifySuccess("ITR AIS connected");
      onClose(true);
    } catch (e) {
      notifyError(`[ITRModal][fetch] ${e.message}`);
    } finally {
      setBusy(false);
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
          Connect ITR
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
      <form onSubmit={handleFetchAIS} className="space-y-4">
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
          <label className="block mb-1 font-medium">
            Assessment Year (optional)
          </label>
          <input
            name="year"
            type="text"
            value={form.year}
            onChange={handleInput}
            className="border border-gray-300 rounded-lg p-2.5 w-full"
            placeholder="e.g. 2024"
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
          <span className="text-sm">I consent to connect my ITR</span>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2.5 w-full"
          disabled={busy}
          data-testid="modal-submit"
        >
          {busy ? "Fetching..." : "Fetch AIS"}
        </button>
      </form>
    </ModalWrapper>
  );
}
