import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";

const FIELDS = [
  "full_name",
  "pan",
  "dob",
  "aadhaar",
  "profession",
  "marital_status",
  "marital_date",
  "itr_login_username",
];

export default function FamilyPanel({ userId }) {
  const [family, setFamily] = useState([]);
  const [form, setForm] = useState({
    full_name: "",
    pan: "",
    dob: "",
    aadhaar: "",
    profession: "",
    marital_status: "Single",
    marital_date: "",
    itr_login_username: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: rows } = await supabase
          .from("family_members")
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
    // Validate required fields
    if (!form.full_name || !form.pan || !form.dob)
      return notifyError("Full Name, PAN, and DOB required");
    // PAN format validation
    if (!/^([A-Z]{5}[0-9]{4}[A-Z])$/.test(form.pan))
      return notifyError("Invalid PAN format");
    // Marital date required if Married
    if (form.marital_status === "Married" && !form.marital_date)
      return notifyError("Marital Date required for Married status");
    try {
      const payload = { ...form, user_id: userId };
      if (editingId) {
        const { error } = await supabase
          .from("family_members")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        notifySuccess("Family member updated");
      } else {
        const { error } = await supabase.from("family_members").insert(payload);
        if (error) throw error;
        notifySuccess("Family member added");
      }
      setEditingId(null);
      setForm({
        full_name: "",
        pan: "",
        dob: "",
        aadhaar: "",
        profession: "",
        marital_status: "Single",
        marital_date: "",
        itr_login_username: "",
      });
      // Reload
      const { data: rows } = await supabase
        .from("family_members")
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
      const { error } = await supabase
        .from("family_members")
        .delete()
        .eq("id", id);
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
      <div className="flex items-center mb-2">
        <input
          type="text"
          className="border rounded px-2 mr-2"
          placeholder="Search by name or relation"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="ml-auto px-3 py-1 rounded bg-blue-600 text-white"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
      <table className="w-full text-sm" data-testid="family-table">
        <thead>
          <tr className="bg-gray-50">
            {FIELDS.map((field) => (
              <th key={field}>{field.replace(/_/g, " ")}</th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {family
            .filter(
              (row) =>
                row.full_name?.toLowerCase().includes(search.toLowerCase()) ||
                row.profession?.toLowerCase().includes(search.toLowerCase())
            )
            .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
            .map((row) => (
              <tr
                key={row.id}
                className="border-b"
                data-testid={`family-row-${row.id}`}
              >
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
                <td className="text-right">
                  {/* 3-dots dropdown menu */}
                  <div
                    className="relative inline-block text-left"
                    data-testid={`family-menu-${row.id}`}
                  >
                    <button
                      className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                      aria-label="Actions"
                      onClick={() =>
                        setEditingId(editingId === row.id ? null : row.id)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <circle cx="5" cy="12" r="1.5" />
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="19" cy="12" r="1.5" />
                      </svg>
                    </button>
                    {editingId === row.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-30">
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          data-testid={`family-edit-${row.id}`}
                          onClick={() => handleEdit(row)}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-red-100"
                          data-testid={`family-delete-${row.id}`}
                          onClick={() => handleDelete(row.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          {/* Add row */}
          <tr>
            {FIELDS.map((field) => (
              <td key={field}>
                <input
                  value={form[field] || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [field]: e.target.value }))
                  }
                  className="border rounded px-2"
                  placeholder={field.replace(/_/g, " ")}
                  data-testid={`family-form-${field}`}
                />
              </td>
            ))}
            <td>
              <button
                className="text-green-600"
                data-testid="family-add"
                onClick={handleSave}
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      {/* Pagination */}
      {family.length > PAGE_SIZE && (
        <div className="flex justify-end items-center mt-2 space-x-2">
          <button
            className="px-2 py-1 rounded bg-gray-100"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <span>
            {page} / {Math.ceil(family.length / PAGE_SIZE)}
          </span>
          <button
            className="px-2 py-1 rounded bg-gray-100"
            disabled={page === Math.ceil(family.length / PAGE_SIZE)}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
