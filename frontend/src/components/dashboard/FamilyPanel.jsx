import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";

const FIELDS = [
  "name",
  "relation",
  "PAN",
  "dob",
  "address",
  "profession",
  "marital_status",
  "marital_date",
];

export default function FamilyPanel({ userId }) {
  const [family, setFamily] = useState([]);
  const [form, setForm] = useState({
    name: "",
    relation: "",
    PAN: "",
    dob: "",
    address: "",
    profession: "",
    marital_status: "Single",
    marital_date: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: rows } = await supabase
          .from("family")
          .select("*")
          .eq("user_id", userId);
        setFamily(rows || []);
      } catch (err) {
        notifyError("Failed to load family members");
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
    if (!form.name || !form.relation || !form.dob)
      return notifyError("Name, relation, and DOB required");
    try {
      const payload = { ...form, user_id: userId };
      if (editingId) {
        const { error } = await supabase
          .from("family")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        notifySuccess("Family member updated");
      } else {
        const { error } = await supabase.from("family").insert(payload);
        if (error) throw error;
        notifySuccess("Family member added");
      }
      setEditingId(null);
      setForm({
        name: "",
        relation: "",
        PAN: "",
        dob: "",
        address: "",
        profession: "",
        marital_status: "Single",
        marital_date: "",
      });
      // Reload
      const { data: rows } = await supabase
        .from("family")
        .select("*")
        .eq("user_id", userId);
      setFamily(rows || []);
    } catch (err) {
      notifyError("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this family member?")) return;
    try {
      const { error } = await supabase.from("family").delete().eq("id", id);
      if (error) throw error;
      notifySuccess("Family member deleted");
      setFamily(family.filter((f) => f.id !== id));
    } catch (err) {
      notifyError("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold mb-2">Family Members</h3>
      <table className="w-full text-sm" data-testid="family-table">
        <thead>
          <tr className="bg-gray-50">
            {FIELDS.map((field) => (
              <th key={field}>{field.replace("_", " ")}</th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {family.map((row) => (
            <tr key={row.id} className="border-b">
              {FIELDS.map((field) => (
                <td key={field}>
                  {editingId === row.id ? (
                    <input
                      value={form[field] || ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field]: e.target.value }))
                      }
                      className="border rounded px-2"
                    />
                  ) : (
                    row[field]
                  )}
                </td>
              ))}
              <td>
                {editingId === row.id ? (
                  <>
                    <button
                      className="text-green-600 mr-2"
                      data-testid="btn-save-family"
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
            {FIELDS.map((field) => (
              <td key={field}>
                <input
                  value={form[field] || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [field]: e.target.value }))
                  }
                  className="border rounded px-2"
                  placeholder={field.replace("_", " ")}
                />
              </td>
            ))}
            <td>
              <button
                className="text-green-600"
                data-testid="btn-add-family"
                onClick={handleSave}
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
