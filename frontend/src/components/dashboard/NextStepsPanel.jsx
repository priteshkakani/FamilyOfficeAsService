import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";

const CATEGORIES = ["insurance", "goal", "portfolio", "ops"];
const STATUS = ["pending", "done", "in-progress"];

export default function NextStepsPanel({ userId }) {
  const [steps, setSteps] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "goal",
    due_date: "",
    status: "pending",
    assigned_to: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: rows } = await supabase
          .from("next_steps")
          .select("*")
          .eq("user_id", userId)
          .order("due_date", { ascending: true });
        setSteps(rows || []);
      } catch (err) {
        notifyError("Failed to load next steps");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({ ...row });
  };

  const handleSave = async () => {
    if (!form.title || !form.category || !form.due_date)
      return notifyError("Title, category, and due date required");
    try {
      const payload = { ...form, user_id: userId };
      if (editingId) {
        const { error } = await supabase
          .from("next_steps")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        notifySuccess("Next step updated");
      } else {
        const { error } = await supabase.from("next_steps").insert(payload);
        if (error) throw error;
        notifySuccess("Next step added");
      }
      setEditingId(null);
      setForm({
        title: "",
        category: "goal",
        due_date: "",
        status: "pending",
        assigned_to: "",
      });
      // Reload
      const { data: rows } = await supabase
        .from("next_steps")
        .select("*")
        .eq("user_id", userId)
        .order("due_date", { ascending: true });
      setSteps(rows || []);
    } catch (err) {
      notifyError("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this next step?")) return;
    try {
      const { error } = await supabase.from("next_steps").delete().eq("id", id);
      if (error) throw error;
      notifySuccess("Next step deleted");
      setSteps(steps.filter((s) => s.id !== id));
    } catch (err) {
      notifyError("Delete failed");
    }
  };

  const handleToggleStatus = async (row) => {
    const nextStatus =
      row.status === "pending"
        ? "in-progress"
        : row.status === "in-progress"
        ? "done"
        : "pending";
    try {
      const { error } = await supabase
        .from("next_steps")
        .update({ status: nextStatus })
        .eq("id", row.id);
      if (error) throw error;
      setSteps(
        steps.map((s) => (s.id === row.id ? { ...s, status: nextStatus } : s))
      );
    } catch (err) {
      notifyError("Status update failed");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold mb-2">Next Steps</h3>
      <table className="w-full text-sm" data-testid="next-steps-table">
        <thead>
          <tr className="bg-gray-50">
            <th>Title</th>
            <th>Category</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {steps.map((row) => (
            <tr key={row.id} className="border-b">
              <td>
                {editingId === row.id ? (
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className="border rounded px-2"
                  />
                ) : (
                  row.title
                )}
              </td>
              <td>
                {editingId === row.id ? (
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                    className="border rounded px-2"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                ) : (
                  row.category
                )}
              </td>
              <td>
                {editingId === row.id ? (
                  <input
                    type="date"
                    value={form.due_date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, due_date: e.target.value }))
                    }
                    className="border rounded px-2"
                  />
                ) : (
                  row.due_date
                )}
              </td>
              <td>
                <button
                  className="border rounded px-2 bg-gray-100"
                  onClick={() => handleToggleStatus(row)}
                  title="Toggle status"
                >
                  {row.status}
                </button>
              </td>
              <td>
                {editingId === row.id ? (
                  <input
                    value={form.assigned_to}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, assigned_to: e.target.value }))
                    }
                    className="border rounded px-2"
                  />
                ) : (
                  row.assigned_to
                )}
              </td>
              <td>
                {editingId === row.id ? (
                  <>
                    <button
                      className="text-green-600 mr-2"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                    <button
                      className="text-gray-500"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="text-blue-600 mr-2"
                      onClick={() => handleEdit(row)}
                    >
                      <span role="img" aria-label="edit">
                        ✏️
                      </span>
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => handleDelete(row.id)}
                    >
                      <span role="img" aria-label="delete">
                        🗑️
                      </span>
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className="border rounded px-2"
                placeholder="Title"
              />
            </td>
            <td>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="border rounded px-2"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </td>
            <td>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, due_date: e.target.value }))
                }
                className="border rounded px-2"
              />
            </td>
            <td>
              <span className="text-gray-500">pending</span>
            </td>
            <td>
              <input
                value={form.assigned_to}
                onChange={(e) =>
                  setForm((f) => ({ ...f, assigned_to: e.target.value }))
                }
                className="border rounded px-2"
                placeholder="Assigned to"
              />
            </td>
            <td>
              <button className="text-green-600" onClick={handleSave}>
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
