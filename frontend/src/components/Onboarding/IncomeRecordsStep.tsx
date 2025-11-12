import React, { useState, useEffect } from "react";
import OnboardingLayout from "../../layouts/OnboardingLayout";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";

const FREQUENCIES = ["Yearly", "Monthly", "Quarterly", "Adhoc"];

export default function IncomeRecordsStep({ userId }) {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    source: "",
    amount: "",
    frequency: "Monthly",
    employer: "",
    start_date: "",
    end_date: "",
  });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const refreshRecords = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("income_records")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) notifyError(error.message);
    setRecords(data || []);
  };

  useEffect(() => {
    refreshRecords();
  }, [userId]);

  const addRecord = async (rec) => {
    if (!rec.source) return notifyError("Source required");
    if (!rec.amount) return notifyError("Amount required");
    if (!rec.frequency) return notifyError("Frequency required");
    setSaving(true);
    try {
      const payload = { ...rec, user_id: userId };
      const { error } = await supabase.from("income_records").insert(payload);
      if (error) throw error;
      notifySuccess("Income record added");
      setForm({
        source: "",
        amount: "",
        frequency: "Monthly",
        employer: "",
        start_date: "",
        end_date: "",
      });
      await refreshRecords();
    } catch (err) {
      notifyError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateRecord = async (rec) => {
    if (!editId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("income_records")
        .update(rec)
        .eq("id", editId);
      if (error) throw error;
      notifySuccess("Income record updated");
      setEditId(null);
      setForm({
        source: "",
        amount: "",
        frequency: "Monthly",
        employer: "",
        start_date: "",
        end_date: "",
      });
      await refreshRecords();
    } catch (err) {
      notifyError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this income record?")) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("income_records")
        .delete()
        .eq("id", id);
      if (error) throw error;
      notifySuccess("Income record deleted");
      await refreshRecords();
    } catch (err) {
      notifyError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const totalMonthly = records.reduce(
    (sum, r) => sum + (r.frequency === "Monthly" ? Number(r.amount) : 0),
    0
  );
  const totalYearly = records.reduce(
    (sum, r) => sum + (r.frequency === "Yearly" ? Number(r.amount) : 0),
    0
  );

  return (
    <OnboardingLayout title="Income & Employment">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Income Source Name
            </label>
            <input
              value={form.source}
              onChange={(e) =>
                setForm((f) => ({ ...f, source: e.target.value }))
              }
              placeholder="Source Name"
              className="w-full border rounded-lg p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Amount</label>
            <input
              type="number"
              min="0"
              value={form.amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, amount: e.target.value }))
              }
              placeholder="Amount"
              className="w-full border rounded-lg p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Frequency
            </label>
            <select
              value={form.frequency}
              onChange={(e) =>
                setForm((f) => ({ ...f, frequency: e.target.value }))
              }
              className="w-full border rounded-lg p-2.5"
            >
              {FREQUENCIES.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Employer / Business Name
            </label>
            <input
              value={form.employer}
              onChange={(e) =>
                setForm((f) => ({ ...f, employer: e.target.value }))
              }
              placeholder="Employer / Business Name"
              className="w-full border rounded-lg p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) =>
                setForm((f) => ({ ...f, start_date: e.target.value }))
              }
              className="w-full border rounded-lg p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) =>
                setForm((f) => ({ ...f, end_date: e.target.value }))
              }
              className="w-full border rounded-lg p-2.5"
            />
          </div>
          <div className="pt-1">
            {editId ? (
              <button
                onClick={() => updateRecord(form)}
                disabled={saving}
                className="bg-green-600 text-white rounded-lg px-4 py-2.5 hover:bg-green-700 w-full"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            ) : (
              <button
                onClick={() => addRecord(form)}
                disabled={saving}
                className="bg-blue-600 text-white rounded-lg px-4 py-2.5 hover:bg-blue-700 w-full"
              >
                {saving ? "Adding..." : "Add"}
              </button>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Income Records</h3>
          <div className="text-sm text-gray-500">Add your income sources</div>
          {records.length === 0 ? (
            <div className="text-sm text-gray-500">No records added</div>
          ) : (
            <ul className="space-y-2">
              {records.map((r, idx) => (
                <li
                  key={r.id ?? idx}
                  className="border p-2 rounded-md flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{r.source}</div>
                    <div className="text-xs text-gray-500">
                      {r.frequency} - {r.amount}
                    </div>
                    <div className="text-xs text-gray-500">{r.employer}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 hover:underline text-xs"
                      onClick={() => {
                        setEditId(r.id);
                        setForm({
                          source: r.source || "",
                          amount: r.amount || "",
                          frequency: r.frequency || "Monthly",
                          employer: r.employer || "",
                          start_date: r.start_date || "",
                          end_date: r.end_date || "",
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline text-xs"
                      onClick={() => deleteRecord(r.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-4 font-medium">
          Total Monthly Income: {totalMonthly}
        </div>
        <div className="font-medium">Total Yearly Income: {totalYearly}</div>
      </div>
    </OnboardingLayout>
  );
}
