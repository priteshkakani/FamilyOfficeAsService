import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient";
import { useParams } from "react-router-dom";

function Transaction() {
  const { clientId } = useParams();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [menuOpen, setMenuOpen] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "",
    fund_name: "",
    amount: "",
    date: "",
  });
  const [editId, setEditId] = useState(null);

  // Fetch transactions (MF + Stocks)
  const {
    data: transactions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transactions", clientId],
    queryFn: async () => {
      // UUID v4 regex
      const uuidRegex =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
      if (!clientId || !uuidRegex.test(clientId)) return [];
      const { data: mf, error: mfError } = await supabase
        .from("mf_transactions")
        .select("*")
        .eq("user_id", clientId);
      const { data: stocks, error: stocksError } = await supabase
        .from("stock_trades")
        .select("*")
        .eq("user_id", clientId);
      if (mfError || stocksError) throw mfError || stocksError;
      return [...(mf || []), ...(stocks || [])].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    },
    enabled: !!clientId,
    staleTime: 1000 * 60 * 10,
  });

  // Add transaction mutation (example for MF)
  const addMutation = useMutation({
    mutationFn: async (values) => {
      const { error } = await supabase
        .from("mf_transactions")
        .insert([{ ...values, user_id: clientId }]);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(["transactions", clientId]),
  });

  // Edit transaction mutation
  const editMutation = useMutation({
    mutationFn: async (values) => {
      const { error } = await supabase
        .from("mf_transactions")
        .update(values)
        .eq("id", editId)
        .eq("user_id", clientId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(["transactions", clientId]),
  });

  // Delete transaction mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("mf_transactions")
        .delete()
        .eq("id", id)
        .eq("user_id", clientId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(["transactions", clientId]),
  });

  const handleView = (tx) => {
    // Implement view logic (e.g., open modal)
    setForm(tx);
    setShowForm(true);
    setEditId(null);
  };

  const handleEdit = (tx) => {
    setForm(tx);
    setShowForm(true);
    setEditId(tx.id);
  };

  const handleDelete = (tx) => {
    if (window.confirm("Delete this transaction?")) {
      deleteMutation.mutate(tx.id);
    }
    setMenuOpen(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      editMutation.mutate(form);
    } else {
      addMutation.mutate(form);
    }
    setShowForm(false);
    setEditId(null);
    setForm({ type: "", fund_name: "", amount: "", date: "" });
  };

  return (
    <div
      className="bg-white rounded-xl shadow p-6"
      data-testid="panel-ov-transaction"
    >
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      {isLoading ? (
        <div>Loading…</div>
      ) : isError ? (
        <div className="text-red-600">Error loading transactions.</div>
      ) : !transactions?.length ? (
        <div className="text-gray-500">No transactions found.</div>
      ) : (
        <table
          className="min-w-full text-left border"
          data-testid="transactions-table"
        >
          <thead>
            <tr>
              <th className="border-b p-2">Type</th>
              <th className="border-b p-2">Name/Symbol</th>
              <th className="border-b p-2">Amount</th>
              <th className="border-b p-2">Date</th>
              <th className="border-b p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions
              ?.slice((page - 1) * pageSize, page * pageSize)
              .map((tx) => (
                <tr key={tx.id} className="border-b">
                  <td className="p-2">
                    {tx.type || tx.fund_name || tx.symbol}
                  </td>
                  <td className="p-2">{tx.fund_name || tx.symbol}</td>
                  <td className="p-2">₹{tx.amount}</td>
                  <td className="p-2">{tx.date}</td>
                  <td className="p-2">
                    <div
                      className="relative"
                      data-testid={`menu-transaction-${tx.id}`}
                    >
                      <button
                        onClick={() => setMenuOpen(tx.id)}
                        aria-label="Open menu"
                      >
                        <span>⋮</span>
                      </button>
                      {menuOpen === tx.id && (
                        <div className="absolute right-0 mt-2 bg-white border rounded shadow z-10">
                          <button
                            className="block px-4 py-2 w-full text-left"
                            onClick={() => handleView(tx)}
                            data-testid="action-view"
                          >
                            View
                          </button>
                          <button
                            className="block px-4 py-2 w-full text-left"
                            onClick={() => handleEdit(tx)}
                            data-testid="action-edit"
                          >
                            Edit
                          </button>
                          <button
                            className="block px-4 py-2 w-full text-left"
                            onClick={() => handleDelete(tx)}
                            data-testid="action-delete"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      {/* Add/Edit transaction form (example for MF) */}
      {showForm && (
        <form
          onSubmit={handleFormSubmit}
          className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4"
        >
          {/* ...fields for mandates, mutual funds, stocks... */}
          <input
            name="type"
            type="text"
            value={form.type}
            onChange={handleChange}
            placeholder="Type"
            required
          />
          <input
            name="fund_name"
            type="text"
            value={form.fund_name}
            onChange={handleChange}
            placeholder="Fund Name/Symbol"
            required
          />
          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            required
          />
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-1 rounded"
              data-testid="btn-save-transaction"
            >
              Save
            </button>
          </div>
        </form>
      )}
      {transactions?.length > pageSize && (
        <div className="flex gap-2 justify-center mt-2">
          {[...Array(Math.ceil(transactions.length / pageSize))].map((_, i) => (
            <button
              key={i}
              className={`px-2 py-1 rounded ${
                page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
              onClick={() => setPage(i + 1)}
              data-testid={`transactions-page-${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Transaction;
