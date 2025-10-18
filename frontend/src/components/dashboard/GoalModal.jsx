import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { notifySuccess, notifyError } from "../../utils/toast";
import { useClient } from "../../hooks/useClientContext";

export default function GoalModal({ open, onClose, clientId, goal }) {
  const { selectedClient } = useClient();
  const effectiveClient = clientId || selectedClient;
  const [title, setTitle] = useState(goal?.title || "");
  const [amount, setAmount] = useState(goal?.target_amount || "");
  const [date, setDate] = useState(goal?.target_date || "");
  const [priority, setPriority] = useState(goal?.priority || "medium");
  const [notes, setNotes] = useState(goal?.notes || "");
  useEffect(() => {
    setTitle(goal?.title || "");
    setAmount(goal?.target_amount || "");
    setDate(goal?.target_date || "");
    setPriority(goal?.priority || "medium");
    setNotes(goal?.notes || "");
  }, [goal]);

  if (!open) return null;

  const save = async () => {
    try {
      if (goal?.id) {
        const { data, error } = await supabase
          .from("goals")
          .update({
            title,
            target_amount: amount,
            target_date: date,
            priority,
            notes,
          })
          .eq("id", goal.id)
          .eq("user_id", effectiveClient);
        if (error) throw error;
        notifySuccess("Goal updated");
      } else {
        const { data, error } = await supabase.from("goals").insert([
          {
            user_id: effectiveClient,
            title,
            target_amount: amount,
            target_date: date,
            priority,
            notes,
          },
        ]);
        if (error) throw error;
        notifySuccess("Goal created");
      }
      onClose(true);
      window.dispatchEvent(new Event("refresh-client-data"));
    } catch (err) {
      console.error("[GoalModal][save]", err);
      notifyError("Failed to save goal");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      data-testid="goal-modal"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          {goal?.id ? "Edit Goal" : "Add Goal"}
        </h3>
        <label className="block text-sm">Title</label>
        <input
          className="w-full border rounded px-2 py-1 mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="block text-sm">Target Amount</label>
        <input
          className="w-full border rounded px-2 py-1 mb-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <label className="block text-sm">Target Date</label>
        <input
          type="date"
          className="w-full border rounded px-2 py-1 mb-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <label className="block text-sm">Priority</label>
        <select
          className="w-full border rounded px-2 py-1 mb-2"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <label className="block text-sm">Notes</label>
        <textarea
          className="w-full border rounded px-2 py-1 mb-4"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2" onClick={() => onClose(false)}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={save}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
