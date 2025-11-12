import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { notifySuccess, notifyError } from "../../utils/toast";
// import { useClient } from "../../hooks/useClientContext";

export default function TaskModal({ open, onClose, clientId, task }) {
  // const { selectedClient } = useClient();
  const effectiveClient = clientId;
  const [title, setTitle] = useState(task?.title || "");
  const [type, setType] = useState(task?.type || "followup");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [due, setDue] = useState(task?.due_date || "");
  const [notes, setNotes] = useState(task?.notes || "");
  useEffect(() => {
    setTitle(task?.title || "");
    setType(task?.type || "followup");
    setPriority(task?.priority || "medium");
    setDue(task?.due_date || "");
    setNotes(task?.notes || "");
  }, [task]);
  if (!open) return null;

  const save = async () => {
    try {
      if (task?.id) {
        const { data, error } = await supabase
          .from("tasks")
          .update({ title, type, priority, due_date: due, notes })
          .eq("id", task.id)
          .eq("user_id", effectiveClient);
        if (error) throw error;
        notifySuccess("Task updated");
      } else {
        const { data, error } = await supabase.from("tasks").insert([
          {
            user_id: effectiveClient,
            title,
            type,
            priority,
            due_date: due,
            notes,
            status: "open",
          },
        ]);
        if (error) throw error;
        notifySuccess("Task created");
      }
      onClose(true);
      window.dispatchEvent(new Event("refresh-client-data"));
    } catch (err) {
      console.error("[TaskModal][save]", err);
      notifyError("Failed to save task");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      data-testid="task-modal"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          {task?.id ? "Edit Task" : "Add Task"}
        </h3>
        <label className="block text-sm">Title</label>
        <input
          className="w-full border rounded px-2 py-1 mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="block text-sm">Type</label>
        <select
          className="w-full border rounded px-2 py-1 mb-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="followup">Follow-up</option>
          <option value="review">Review</option>
          <option value="create_sip">Create SIP</option>
        </select>
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
        <label className="block text-sm">Due Date</label>
        <input
          type="date"
          className="w-full border rounded px-2 py-1 mb-2"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />
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
