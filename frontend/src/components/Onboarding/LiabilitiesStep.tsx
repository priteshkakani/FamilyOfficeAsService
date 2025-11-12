import React, { useState, useEffect } from "react";
import OnboardingLayout from "../../layouts/OnboardingLayout";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";

const LOAN_TYPES = [
  "Home",
  "Car",
  "Education",
  "Personal",
  "Credit Card",
  "Business",
  "Gold",
  "Other",
];
const SCHEDULES = ["Monthly", "Quarterly", "Yearly"];

export default function LiabilitiesStep({ userId }) {
  const [loans, setLoans] = useState([]);
  const [form, setForm] = useState({
    loan_type: "Home",
    total_amount: "",
    outstanding_amount: "",
    emi_amount: "",
    interest_rate: "",
    payment_schedule: "Monthly",
    remaining_emis: "",
    emi_date: "",
  });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const refreshLoans = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("liabilities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) notifyError(error.message);
    setLoans(data || []);
  };

  useEffect(() => {
    refreshLoans();
  }, [userId]);

  const addLoan = async (loan) => {
    if (!loan.loan_type) return notifyError("Loan type required");
    if (!loan.total_amount) return notifyError("Total amount required");
    if (!loan.outstanding_amount)
      return notifyError("Outstanding amount required");
    if (!loan.emi_amount) return notifyError("EMI amount required");
    if (!loan.interest_rate) return notifyError("Interest rate required");
    if (!loan.payment_schedule) return notifyError("Payment schedule required");
    if (!loan.remaining_emis) return notifyError("Remaining EMIs required");
    if (!loan.emi_date) return notifyError("Date of EMI required");
    setSaving(true);
    try {
      const payload = { ...loan, user_id: userId };
      const { error } = await supabase.from("liabilities").insert(payload);
      if (error) throw error;
      notifySuccess("Loan added");
      setForm({
        loan_type: "Home",
        total_amount: "",
        outstanding_amount: "",
        emi_amount: "",
        interest_rate: "",
        payment_schedule: "Monthly",
        remaining_emis: "",
        emi_date: "",
      });
      await refreshLoans();
    } catch (err) {
      notifyError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateLoan = async (loan) => {
    if (!editId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("liabilities")
        .update(loan)
        .eq("id", editId);
      if (error) throw error;
      notifySuccess("Loan updated");
      setEditId(null);
      setForm({
        loan_type: "Home",
        total_amount: "",
        outstanding_amount: "",
        emi_amount: "",
        interest_rate: "",
        payment_schedule: "Monthly",
        remaining_emis: "",
        emi_date: "",
      });
      await refreshLoans();
    } catch (err) {
      notifyError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteLoan = async (id) => {
    if (!window.confirm("Delete this loan record?")) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("liabilities")
        .delete()
        .eq("id", id);
      if (error) throw error;
      notifySuccess("Loan deleted");
      await refreshLoans();
    } catch (err) {
      notifyError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <OnboardingLayout title="Loans / Liabilities">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Loan Type
            </label>
            <select
              value={form.loan_type}
              onChange={(e) =>
                setForm((f) => ({ ...f, loan_type: e.target.value }))
              }
              className="w-full border rounded-lg p-2.5"
            >
              {LOAN_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Total Amount
            </label>
            <input
              type="number"
              min="0"
              value={form.total_amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, total_amount: e.target.value }))
              }
              placeholder="Total Amount"
              className="w-full border rounded-lg p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Outstanding Amount
            </label>
            <input
              type="number"
              min="0"
              value={form.outstanding_amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, outstanding_amount: e.target.value }))
              }
              placeholder="Outstanding Amount"
              className="w-full border rounded-lg p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              EMI Amount
            </label>
            <input
              type="number"
              min="0"
              value={form.emi_amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, emi_amount: e.target.value }))
              }
              placeholder="EMI Amount"
              className="w-full border rounded-lg p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Interest Rate (%)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.interest_rate}
              onChange={(e) =>
                setForm((f) => ({ ...f, interest_rate: e.target.value }))
              }
              placeholder="Interest Rate"
              className="w-full border rounded-lg p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Payment Schedule
            </label>
            <select
              value={form.payment_schedule}
              onChange={(e) =>
                setForm((f) => ({ ...f, payment_schedule: e.target.value }))
              }
              className="w-full border rounded-lg p-2.5"
            >
              {SCHEDULES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Remaining No. of EMIs
            </label>
            <input
              type="number"
              min="0"
              value={form.remaining_emis}
              onChange={(e) =>
                setForm((f) => ({ ...f, remaining_emis: e.target.value }))
              }
              placeholder="Remaining EMIs"
              className="w-full border rounded-lg p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Date of EMI
            </label>
            <input
              type="date"
              value={form.emi_date}
              onChange={(e) =>
                setForm((f) => ({ ...f, emi_date: e.target.value }))
              }
              className="w-full border rounded-lg p-2.5"
            />
          </div>
          <div className="pt-1">
            {editId ? (
              <button
                onClick={() => updateLoan(form)}
                disabled={saving}
                className="bg-green-600 text-white rounded-lg px-4 py-2.5 hover:bg-green-700 w-full"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            ) : (
              <button
                onClick={() => addLoan(form)}
                disabled={saving}
                className="bg-blue-600 text-white rounded-lg px-4 py-2.5 hover:bg-blue-700 w-full"
              >
                {saving ? "Adding..." : "Add"}
              </button>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Loans / Liabilities</h3>
          <div className="text-sm text-gray-500">
            Add your loans/liabilities
          </div>
          {loans.length === 0 ? (
            <div className="text-sm text-gray-500">No records added</div>
          ) : (
            <ul className="space-y-2">
              {loans.map((l, idx) => (
                <li
                  key={l.id ?? idx}
                  className="border p-2 rounded-md flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{l.loan_type}</div>
                    <div className="text-xs text-gray-500">
                      Outstanding: {l.outstanding_amount}
                    </div>
                    <div className="text-xs text-gray-500">
                      EMI: {l.emi_amount} @ {l.interest_rate}%
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 hover:underline text-xs"
                      onClick={() => {
                        setEditId(l.id);
                        setForm({
                          loan_type: l.loan_type || "Home",
                          total_amount: l.total_amount || "",
                          outstanding_amount: l.outstanding_amount || "",
                          emi_amount: l.emi_amount || "",
                          interest_rate: l.interest_rate || "",
                          payment_schedule: l.payment_schedule || "Monthly",
                          remaining_emis: l.remaining_emis || "",
                          emi_date: l.emi_date || "",
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline text-xs"
                      onClick={() => deleteLoan(l.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
}
