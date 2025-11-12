import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function RatioForm({ clientId }) {
  const [ratios, setRatios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({
    name: "",
    value: "",
    notes: "",
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      if (!clientId) return;
      const { data, error } = await supabase
        .from("ratios")
        .select("*")
        .eq("user_id", clientId)
        .order("name", { ascending: true });
      if (error) setError("Failed to load ratios");
      setRatios(data || []);
      setLoading(false);
    }
    load();
  }, [clientId]);

  const handleDelete = async (id) => {
    setError("");
    const prev = ratios;
    setRatios(ratios.filter((r) => r.id !== id));
    const { error } = await supabase
      .from("ratios")
      .delete()
      .eq("id", id)
      .eq("user_id", clientId);
    if (error) {
      setRatios(prev);
      setError("Delete failed");
    }
  };
  const handleEdit = (row) => {
    setEditRow(row);
    setForm({ ...row });
  };
  const handleSave = async () => {
    setError("");
    const payload = { ...form, user_id: clientId };
    let res;
    if (editRow) {
      res = await supabase
        .from("ratios")
        .update(payload)
        .eq("id", editRow.id)
        .eq("user_id", clientId);
    } else {
      res = await supabase.from("ratios").insert([payload]);
    }
    if (res.error) {
      setError("Save failed");
    } else {
      setEditRow(null);
      setForm({ name: "", value: "", notes: "" });
      // refetch
      const { data } = await supabase
        .from("ratios")
        .select("*")
        .eq("user_id", clientId)
        .order("name", { ascending: true });
      setRatios(data || []);
    }
  };

  if (loading) return <div data-testid="ratio-loading">Loading ratios…</div>;
  if (error)
    return (
      <div className="text-red-600 mb-2" role="alert">
        {error}
      </div>
    );

  return (
    <div data-testid="ratio-page">
      <h2 className="text-xl font-semibold mb-4">Ratios</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setEditRow(null)}
        data-testid="btn-add-ratio"
      >
        Add Ratio
      </button>
      <table className="w-full text-sm mb-4" data-testid="ratio-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
            <th>Notes</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ratios.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.value}</td>
              <td>{r.notes}</td>
              <td>
                <button
                  className="text-blue-600 mr-2"
                  onClick={() => handleEdit(r)}
                  data-testid={`edit-ratio-${r.id}`}
                >
                  Edit
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(r.id)}
                  data-testid={`delete-ratio-${r.id}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Edit/Add Modal */}
      {(editRow !== null || editRow === null) && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 ${
            editRow === null ? "hidden" : ""
          }`}
          role="dialog"
          aria-modal="true"
          data-testid="ratio-edit-modal"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold mb-2">
              {editRow ? "Edit Ratio" : "Add Ratio"}
            </h3>
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              required
            />
            <input
              name="value"
              type="text"
              placeholder="Value"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              required
            />
            <input
              name="notes"
              type="text"
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="border rounded px-2 py-1 w-full"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setEditRow(null)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-1 rounded"
                data-testid="btn-save-ratio"
              >
                Save
              </button>
            </div>
            {error && (
              <div className="text-red-600" role="alert">
                {error}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
