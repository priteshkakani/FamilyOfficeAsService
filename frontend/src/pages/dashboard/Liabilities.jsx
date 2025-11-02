import React, { useState, useEffect } from "react";
import { useClient } from "../../hooks/useClientContext";
import DataTable from "../../components/dashboard/DataTable";
import { supabase } from "../../supabaseClient";

export default function Liabilities() {
  const { selectedClient } = useClient();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({
    type: "",
    institution: "",
    total_amount: "",
    outstanding_amount: "",
    emi_amount: "",
    interest_rate: "",
    schedule: "",
    remaining_emis: "",
    emi_date: "",
    as_of_date: "",
  });
  const pageSize = 10;

  useEffect(() => {
    // UUID v4 regex
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (
      !selectedClient ||
      typeof selectedClient !== "string" ||
      !uuidRegex.test(selectedClient)
    ) {
      console.error(
        "Invalid selectedClient for liabilities query:",
        selectedClient
      );
      setError("Invalid client ID");
      setLoading(false);
      return;
    }
    async function load() {
      setLoading(true);
      setError("");
      const { data, error } = await supabase
        .from("liabilities")
        .select("*")
        .eq("user_id", selectedClient)
        .order("as_of_date", { ascending: false })
        .limit(100);
      if (error) {
        console.error("Supabase error loading liabilities:", error);
        setError("Failed to load liabilities");
      }
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
      .from("liabilities")
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
        .from("liabilities")
        .update(payload)
        .eq("id", editRow.id)
        .eq("user_id", selectedClient);
    } else {
      res = await supabase.from("liabilities").insert([payload]);
    }
    if (res.error) {
      setError("Save failed");
    } else {
      setEditRow(null);
      setForm({
        type: "",
        institution: "",
        total_amount: "",
        outstanding_amount: "",
        emi_amount: "",
        interest_rate: "",
        schedule: "",
        remaining_emis: "",
        emi_date: "",
        as_of_date: "",
      });
      // refetch
      const { data } = await supabase
        .from("liabilities")
        .select("*")
        .eq("user_id", selectedClient)
        .order("as_of_date", { ascending: false })
        .limit(100);
      setRows(data || []);
    }
  };

  // Pagination
  const pagedRows = rows.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(rows.length / pageSize);

  const columns = [
    { key: "type", title: "Type" },
    { key: "institution", title: "Institution" },
    {
      key: "total_amount",
      title: "Total Amount",
      render: (r) => `₹${Number(r.total_amount || 0).toLocaleString("en-IN")}`,
    },
    {
      key: "outstanding_amount",
      title: "Outstanding",
      render: (r) =>
        `₹${Number(r.outstanding_amount || 0).toLocaleString("en-IN")}`,
    },
    {
      key: "emi_amount",
      title: "EMI",
      render: (r) => `₹${Number(r.emi_amount || 0).toLocaleString("en-IN")}`,
    },
    { key: "interest_rate", title: "Interest Rate" },
    { key: "schedule", title: "Schedule" },
    { key: "remaining_emis", title: "Remaining EMIs" },
    { key: "emi_date", title: "EMI Date" },
    { key: "as_of_date", title: "As of Date" },
    {
      key: "actions",
      title: "",
      render: (row) => (
        <div className="relative">
          <button
            className="p-1"
            onClick={() => setMenuOpen(row.id)}
            aria-label="Open menu"
            data-testid={`menu-liabilities-${row.id}`}
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
    return <div data-testid="liabilities-loading">Loading liabilities…</div>;
  if (error)
    return (
      <div className="text-red-600 mb-2" role="alert">
        {error}
      </div>
    );

  return (
    <div data-testid="liabilities-page">
      <h2 className="text-xl font-semibold mb-4">Liabilities</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setEditRow(null)}
        data-testid="btn-add-liability"
      >
        Add Liability
      </button>
      <DataTable
        columns={columns}
        rows={pagedRows}
        dataTestId="liabilities-table"
      />
      {totalPages > 1 && (
        <div
          className="flex gap-2 mt-4"
          role="navigation"
          aria-label="Liabilities pagination"
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
          data-testid="liabilities-edit-modal"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold mb-2">
              {editRow ? "Edit Liability" : "Add Liability"}
            </h3>
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
              name="institution"
              type="text"
              placeholder="Institution"
              value={form.institution}
              onChange={(e) =>
                setForm({ ...form, institution: e.target.value })
              }
              className="border rounded px-2 py-1 w-full"
              required
            />
            <input
              name="total_amount"
              type="number"
              placeholder="Total Amount"
              value={form.total_amount}
              onChange={(e) =>
                setForm({ ...form, total_amount: e.target.value })
              }
              className="border rounded px-2 py-1 w-full"
              required
            />
            <input
              name="outstanding_amount"
              type="number"
              placeholder="Outstanding Amount"
              value={form.outstanding_amount}
              onChange={(e) =>
                setForm({ ...form, outstanding_amount: e.target.value })
              }
              className="border rounded px-2 py-1 w-full"
              required
            />
            <input
              name="emi_amount"
              type="number"
              placeholder="EMI"
              value={form.emi_amount}
              onChange={(e) => setForm({ ...form, emi_amount: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              required
            />
            <input
              name="interest_rate"
              type="number"
              placeholder="Interest Rate"
              value={form.interest_rate}
              onChange={(e) =>
                setForm({ ...form, interest_rate: e.target.value })
              }
              className="border rounded px-2 py-1 w-full"
            />
            <input
              name="schedule"
              type="text"
              placeholder="Schedule"
              value={form.schedule}
              onChange={(e) => setForm({ ...form, schedule: e.target.value })}
              className="border rounded px-2 py-1 w-full"
            />
            <input
              name="remaining_emis"
              type="number"
              placeholder="Remaining EMIs"
              value={form.remaining_emis}
              onChange={(e) =>
                setForm({ ...form, remaining_emis: e.target.value })
              }
              className="border rounded px-2 py-1 w-full"
            />
            <input
              name="emi_date"
              type="date"
              placeholder="EMI Date"
              value={form.emi_date}
              onChange={(e) => setForm({ ...form, emi_date: e.target.value })}
              className="border rounded px-2 py-1 w-full"
            />
            <input
              name="as_of_date"
              type="date"
              placeholder="As of Date"
              value={form.as_of_date}
              onChange={(e) => setForm({ ...form, as_of_date: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              required
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
                data-testid="btn-save-liability"
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
