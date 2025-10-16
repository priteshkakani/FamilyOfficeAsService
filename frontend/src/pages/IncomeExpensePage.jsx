import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import LoadingSpinner from "../components/LoadingSpinner";
import { notifyError, notifySuccess } from "../utils/toast";
import { Dialog } from "@headlessui/react";

const TABS = ["Income", "Expenses"];

function AddIncomeModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    source: "",
    category: "",
    amount: "",
    frequency: "",
    date_received: "",
    notes: "",
  });
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase
        .from("income_records")
        .insert([{ ...form, amount: parseFloat(form.amount) }]);
      if (error) throw error;
      notifySuccess("Income added!");
      onSuccess();
      onClose();
    } catch (err) {
      notifyError(err.message || "Failed to add income");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white rounded-xl shadow-md p-6 w-full max-w-md mx-auto space-y-4 z-10">
          <Dialog.Title className="text-xl font-semibold text-gray-800 mb-2">
            Add Income
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="source"
              value={form.source}
              onChange={handleChange}
              required
              placeholder="Source"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-200"
            />
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              placeholder="Category"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-200"
            />
            <input
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              type="number"
              step="0.01"
              placeholder="Amount"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-200"
            />
            <input
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              placeholder="Frequency (e.g. Monthly)"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-200"
            />
            <input
              name="date_received"
              value={form.date_received}
              onChange={handleChange}
              required
              type="date"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-200"
            />
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Notes"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-200"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2.5"
                disabled={busy}
              >
                {busy ? <LoadingSpinner text="Saving..." /> : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}

function AddExpenseModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    category: "",
    subcategory: "",
    amount: "",
    payment_mode: "",
    date_incurred: "",
    recurring: false,
    notes: "",
  });
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase
        .from("expense_records")
        .insert([{ ...form, amount: parseFloat(form.amount) }]);
      if (error) throw error;
      notifySuccess("Expense added!");
      onSuccess();
      onClose();
    } catch (err) {
      notifyError(err.message || "Failed to add expense");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white rounded-xl shadow-md p-6 w-full max-w-md mx-auto space-y-4 z-10">
          <Dialog.Title className="text-xl font-semibold text-gray-800 mb-2">
            Add Expense
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              placeholder="Category"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-200"
            />
            <input
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              placeholder="Subcategory"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-200"
            />
            <input
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              type="number"
              step="0.01"
              placeholder="Amount"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-200"
            />
            <input
              name="payment_mode"
              value={form.payment_mode}
              onChange={handleChange}
              placeholder="Payment Mode"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-200"
            />
            <input
              name="date_incurred"
              value={form.date_incurred}
              onChange={handleChange}
              required
              type="date"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-200"
            />
            <label className="flex items-center gap-2">
              <input
                name="recurring"
                type="checkbox"
                checked={form.recurring}
                onChange={handleChange}
              />
              Recurring
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Notes"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-200"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2.5"
                disabled={busy}
              >
                {busy ? <LoadingSpinner text="Saving..." /> : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}

export default function IncomeExpensePage() {
  const [tab, setTab] = useState("Income");
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        supabase.from("income_records").select("*"),
        supabase.from("expense_records").select("*"),
      ]);
      if (incomeRes.error) throw incomeRes.error;
      if (expenseRes.error) throw expenseRes.error;
      setIncome(incomeRes.data || []);
      setExpenses(expenseRes.data || []);
    } catch (err) {
      notifyError(err.message || "Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6 mt-8">
      <div className="flex gap-4 mb-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 rounded-lg font-medium ${
              tab === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {loading ? (
        <LoadingSpinner text="Loading records..." />
      ) : tab === "Income" ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Income Records
            </h2>
            <button
              onClick={() => setShowIncomeModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-4 py-2.5"
            >
              Add Income
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border">
              <thead>
                <tr>
                  <th className="border-b p-2">Source</th>
                  <th className="border-b p-2">Category</th>
                  <th className="border-b p-2">Frequency</th>
                  <th className="border-b p-2">Amount</th>
                  <th className="border-b p-2">Date</th>
                  <th className="border-b p-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {income.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-4">
                      No income records
                    </td>
                  </tr>
                ) : (
                  income.map((row) => (
                    <tr key={row.id}>
                      <td className="p-2">{row.source}</td>
                      <td className="p-2">{row.category}</td>
                      <td className="p-2">{row.frequency}</td>
                      <td className="p-2 font-medium text-green-600">
                        ₹{row.amount}
                      </td>
                      <td className="p-2">{row.date_received}</td>
                      <td className="p-2">{row.notes}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <AddIncomeModal
            open={showIncomeModal}
            onClose={() => setShowIncomeModal(false)}
            onSuccess={fetchData}
          />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Expense Records
            </h2>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-4 py-2.5"
            >
              Add Expense
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border">
              <thead>
                <tr>
                  <th className="border-b p-2">Category</th>
                  <th className="border-b p-2">Subcategory</th>
                  <th className="border-b p-2">Payment Mode</th>
                  <th className="border-b p-2">Amount</th>
                  <th className="border-b p-2">Date</th>
                  <th className="border-b p-2">Recurring</th>
                  <th className="border-b p-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-400 py-4">
                      No expense records
                    </td>
                  </tr>
                ) : (
                  expenses.map((row) => (
                    <tr key={row.id}>
                      <td className="p-2">{row.category}</td>
                      <td className="p-2">{row.subcategory}</td>
                      <td className="p-2">{row.payment_mode}</td>
                      <td className="p-2 font-medium text-red-600">
                        ₹{row.amount}
                      </td>
                      <td className="p-2">{row.date_incurred}</td>
                      <td className="p-2">{row.recurring ? "Yes" : "No"}</td>
                      <td className="p-2">{row.notes}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <AddExpenseModal
            open={showExpenseModal}
            onClose={() => setShowExpenseModal(false)}
            onSuccess={fetchData}
          />
        </>
      )}
    </div>
  );
}
