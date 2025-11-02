import React, { useState, useEffect } from "react";
import { useClient } from "../../hooks/useClientContext";
import DataTable from "../../components/dashboard/DataTable";
import { supabase } from "../../supabaseClient";

export default function Insurance() {
  const { selectedClient } = useClient();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({
    provider: "",
    policy_no: "",
    type: "",
    sum_assured: "",
    premium: "",
    premium_freq: "",
    start_date: "",
    end_date: "",
    status: "",
  });
  const pageSize = 10;

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      if (!selectedClient) return;
      const { data, error } = await supabase
        .from("insurance")
        .select("*")
        .eq("user_id", selectedClient)
        .order("start_date", { ascending: false })
        .limit(100);
      if (error) setError("Failed to load insurance");
      setRows(data || []);
      setLoading(false);
    }
    load();
  }, [selectedClient]);

  // CRUD handlers
  const handleDelete = async (id) => {
    setError("");
    const prev = rows;
    setRows(rows.filter((a) => a.id !== id));
    const { error } = await supabase
      .from("insurance")
      .delete()
      .eq("id", id)
      .eq("user_id", selectedClient);
    if (error) {
      setRows(prev);
      setError("Delete failed");
    }
  };
  const handleEdit = (row) => {
    setEditRow(row);
    setForm({ ...row });
  };
  const handleSave = async () => {
    setError("");
    const payload = { ...form, user_id: selectedClient };
    let res;
    if (editRow) {
      res = await supabase
        .from("insurance")
        .update(payload)
        .eq("id", editRow.id)
        .eq("user_id", selectedClient);
    } else {
      res = await supabase.from("insurance").insert([payload]);
    }
    if (res.error) {
      setError("Save failed");
    } else {
      setEditRow(null);
      setForm({
        provider: "",
        policy_no: "",
        type: "",
        sum_assured: "",
        premium: "",
        premium_freq: "",
        start_date: "",
        end_date: "",
        status: "",
      });
      // refetch
      const { data } = await supabase
        .from("insurance")
        .select("*")
        .eq("user_id", selectedClient)
        .order("start_date", { ascending: false })
        .limit(100);
      setRows(data || []);
    }
  };

  // Pagination
  const pagedRows = rows.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(rows.length / pageSize);

  const columns = [
    { key: "provider", title: "Provider" },
    { key: "policy_no", title: "Policy No" },
    { key: "type", title: "Type" },
    {
      key: "sum_assured",
      title: "Sum Assured",
      render: (r) => `₹${Number(r.sum_assured || 0).toLocaleString("en-IN")}`,
    },
    {
      key: "premium",
      title: "Premium",
      render: (r) => `₹${Number(r.premium || 0).toLocaleString("en-IN")}`,
    },
    { key: "premium_freq", title: "Premium Freq" },
    { key: "start_date", title: "Start Date" },
    { key: "end_date", title: "End Date" },
    { key: "status", title: "Status" },
    {
      key: "actions",
      title: "",
      render: (row) => (
        <div className="relative">
          <button
            className="p-1"
            onClick={() => setMenuOpen(row.id)}
            aria-label="Open menu"
            data-testid={`menu-insurance-${row.id}`}
          >
            ⋮
          </button>
          {menuOpen === row.id && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow z-10">
              <button
                className="block px-4 py-2 w-full text-left"
                onClick={() => {
                  setEditRow(row);
                  setMenuOpen(null);
                }}
                data-testid="action-edit"
              >
                Edit
              </button>
              <button
                className="block px-4 py-2 w-full text-left"
                onClick={() => {
                  handleDelete(row.id);
                  setMenuOpen(null);
                }}
                data-testid="action-delete"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  if (loading)
    return <div data-testid="insurance-loading">Loading insurance…</div>;
  if (error)
    return (
      <div className="text-red-600 mb-2" role="alert">
        {error}
      </div>
    );

  return (
    <div data-testid="insurance-page">
      <h2 className="text-xl font-semibold mb-4">Insurance</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setEditRow(null)}
        data-testid="btn-add-insurance"
      >
        Add Insurance
      </button>
      <DataTable
        columns={columns}
        rows={pagedRows}
        dataTestId="insurance-table"
      />
      {totalPages > 1 && (
        <div
          className="flex gap-2 mt-4"
          role="navigation"
          aria-label="Insurance pagination"
        >
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-2 py-1 border rounded"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-2 py-1 border rounded"
          >
            Next
          </button>
        </div>
      )}
      {/* Edit/Add Modal */}
      {(editRow !== null || editRow === null) && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 ${
            editRow === null ? "hidden" : ""
          }`}
          role="dialog"
          aria-modal="true"
          data-testid="insurance-edit-modal"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold mb-2">
              {editRow ? "Edit Insurance" : "Add Insurance"}
            </h3>
            <input
              name="provider"
              type="text"
              placeholder="Provider"
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              required
            />
            <input
              name="policy_no"
              type="text"
              placeholder="Policy No"
              value={form.policy_no}
              onChange={(e) => setForm({ ...form, policy_no: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              required
            />
            <input
              name="type"
              type="text"
              placeholder="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              required
            />
            <input
              name="sum_assured"
              type="number"
              placeholder="Sum Assured"
              value={form.sum_assured}
              onChange={(e) =>
                setForm({ ...form, sum_assured: e.target.value })
              }
              className="border rounded px-2 py-1 w-full"
              required
            />
            <input
              name="premium"
              type="number"
              placeholder="Premium"
              value={form.premium}
              onChange={(e) => setForm({ ...form, premium: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              required
            />
            <input
              name="premium_freq"
              type="text"
              placeholder="Premium Freq"
              value={form.premium_freq}
              onChange={(e) =>
                setForm({ ...form, premium_freq: e.target.value })
              }
              className="border rounded px-2 py-1 w-full"
            />
            <input
              name="start_date"
              type="date"
              placeholder="Start Date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              required
            />
            <input
              name="end_date"
              type="date"
              placeholder="End Date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              required
            />
            <input
              name="status"
              type="text"
              placeholder="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
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
                data-testid="btn-save-insurance"
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
