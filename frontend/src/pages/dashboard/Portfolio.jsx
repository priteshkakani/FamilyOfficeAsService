import React, { useState } from "react";
import { useClient } from "../../hooks/useClientContext";
import DataTable from "../../components/dashboard/DataTable";
import { supabase } from "../../supabaseClient";
import { MoreVertical } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function Portfolio() {
  const { client } = useClient();
  const userId = client?.id;
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    amount: "",
    as_of_date: "",
  });
  const pageSize = 10;

  // React Query: fetch assets
  const {
    data: assets = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["assets", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("user_id", userId)
        .order("as_of_date", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  // React Query: mutations
  const addMutation = useMutation({
    mutationFn: async (payload) => {
      const { error } = await supabase.from("assets").insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["assets", userId]);
      toast.success("Asset added");
    },
    onError: (err) => toast.error(err.message || "Add failed"),
  });
  const editMutation = useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const { error } = await supabase
        .from("assets")
        .update(payload)
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["assets", userId]);
      toast.success("Asset updated");
    },
    onError: (err) => toast.error(err.message || "Edit failed"),
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("assets")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["assets", userId]);
      toast.success("Asset deleted");
    },
    onError: (err) => toast.error(err.message || "Delete failed"),
  });

  // CRUD handlers
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    setMenuOpen(null);
  };
  const handleEdit = (row) => {
    setEditRow(row);
    setForm({
      name: row.name,
      category: row.category,
      amount: row.amount,
      as_of_date: row.as_of_date,
    });
  };
  const handleSave = () => {
    // Validation
    if (
      !form.name.trim() ||
      !form.category.trim() ||
      !form.amount ||
      !form.as_of_date
    ) {
      toast.error("All fields required");
      return;
    }
    if (Number(form.amount) < 0) {
      toast.error("Amount must be non-negative");
      return;
    }
    const payload = { ...form, user_id: userId };
    if (editRow) {
      editMutation.mutate({ id: editRow.id, ...payload });
    } else {
      addMutation.mutate(payload);
    }
    setEditRow(null);
    setForm({ name: "", category: "", amount: "", as_of_date: "" });
  };

  // Pagination
  const pagedAssets = assets.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(assets.length / pageSize);

  const columns = [
    { key: "name", title: "Name" },
    { key: "category", title: "Category" },
    {
      key: "amount",
      title: "Amount",
      render: (r) => `₹${Number(r.amount || 0).toLocaleString("en-IN")}`,
    },
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
            data-testid={`menu-assets-${row.id}`}
          >
            <MoreVertical size={18} />
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

  if (isLoading)
    return (
      <div
        data-testid="portfolio-loading"
        className="animate-pulse py-8 text-center text-gray-400"
      >
        Loading portfolio…
      </div>
    );
  if (isError)
    return (
      <div
        className="text-red-600 mb-2"
        role="alert"
        data-testid="portfolio-error"
      >
        {error?.message || "Error loading assets"}
      </div>
    );
  if (!assets.length)
    return (
      <div
        data-testid="portfolio-empty"
        className="py-8 text-center text-gray-500"
      >
        No assets found.
        <br />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          onClick={() => setEditRow({})}
          data-testid="btn-add-asset-empty"
        >
          Add Asset
        </button>
      </div>
    );

  return (
    <div data-testid="portfolio-page">
      <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setEditRow({})}
        data-testid="btn-add-asset"
      >
        Add Asset
      </button>
      <DataTable
        columns={columns}
        rows={pagedAssets}
        dataTestId="portfolio-table"
      />
      {totalPages > 1 && (
        <div
          className="flex gap-2 mt-4"
          role="navigation"
          aria-label="Portfolio pagination"
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
      {editRow !== null && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          data-testid="portfolio-edit-modal"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold mb-2">
              {editRow && editRow.id ? "Edit Asset" : "Add Asset"}
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
              name="category"
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              required
            />
            <input
              name="amount"
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              required
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
                data-testid="btn-save-asset"
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
