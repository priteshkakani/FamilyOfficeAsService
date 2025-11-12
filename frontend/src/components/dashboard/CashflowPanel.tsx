import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import formatINR from "../../utils/formatINR";
import { notifyError, notifySuccess } from "../../utils/toast";

function normalizeIncome(records) {
  // Normalize all income records to monthly
  const monthly = [];
  records.forEach((r) => {
    let amt = Number(r.amount || 0);
    switch ((r.frequency || "monthly").toLowerCase()) {
      case "yearly":
        amt = amt / 12;
        break;
      case "quarterly":
        amt = amt / 3;
        break;
      case "adhoc":
        amt = amt / 12;
        break;
      default:
        break;
    }
    monthly.push({ ...r, monthly_amount: amt });
  });
  return monthly;
}

export default function CashflowPanel() {
  const [incomeRecords, setIncomeRecords] = useState([]);
  const [expenseRecords, setExpenseRecords] = useState([]);
  const [profile, setProfile] = useState({
    monthly_income: "",
    monthly_expenses: "",
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    monthly_income: "",
    monthly_expenses: "",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Fetch profile
        const { data: profRows } = await supabase
          .from("profiles")
          .select("monthly_income, monthly_expenses")
          .maybeSingle();
        setProfile(profRows || { monthly_income: "", monthly_expenses: "" });
        setForm({
          monthly_income: profRows?.monthly_income || "",
          monthly_expenses: profRows?.monthly_expenses || "",
        });
        // Fetch income records
        const { data: incRows } = await supabase
          .from("income_records")
          .select("amount, frequency, date");
        setIncomeRecords(incRows || []);
        // Fetch expense records
        const { data: expRows } = await supabase
          .from("expense_records")
          .select("amount, category, date");
        setExpenseRecords(expRows || []);
        // Build chart data for last 12 months
        const now = new Date();
        const months = [];
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push({
            month: d.toLocaleString("default", {
              month: "short",
              year: "2-digit",
            }),
            income: 0,
            expenses: 0,
          });
        }
        // Income
        normalizeIncome(incRows || []).forEach((r) => {
          if (!r.date) return;
          const d = new Date(r.date);
          const idx = months.findIndex((m) => {
            const md = new Date(
              now.getFullYear(),
              now.getMonth() - (11 - months.indexOf(m)),
              1
            );
            return (
              d.getFullYear() === md.getFullYear() &&
              d.getMonth() === md.getMonth()
            );
          });
          if (idx >= 0) months[idx].income += r.monthly_amount;
        });
        // Expenses
        (expRows || []).forEach((r) => {
          if (!r.date) return;
          const d = new Date(r.date);
          const idx = months.findIndex((m) => {
            const md = new Date(
              now.getFullYear(),
              now.getMonth() - (11 - months.indexOf(m)),
              1
            );
            return (
              d.getFullYear() === md.getFullYear() &&
              d.getMonth() === md.getMonth()
            );
          });
          if (idx >= 0) months[idx].expenses += Number(r.amount || 0);
        });
        setChartData(months);
      } catch (err) {
        notifyError("Failed to load cashflow data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      const { monthly_income, monthly_expenses } = form;
      if (!monthly_income || !monthly_expenses)
        return notifyError("Both fields required");
      const payload = {
        monthly_income: Number(monthly_income),
        monthly_expenses: Number(monthly_expenses),
      };
      const { error } = await supabase.from("profiles").update(payload);
      if (error) throw error;
      setProfile(payload);
      notifySuccess("Cashflow updated");
      // Invalidate and refetch chart data
      setLoading(true);
      try {
        // Fetch updated income/expense records and profile
        const { data: profRows } = await supabase
          .from("profiles")
          .select("monthly_income, monthly_expenses")
          .maybeSingle();
        setProfile(profRows || { monthly_income: "", monthly_expenses: "" });
        setForm({
          monthly_income: profRows?.monthly_income || "",
          monthly_expenses: profRows?.monthly_expenses || "",
        });
        const { data: incRows } = await supabase
          .from("income_records")
          .select("amount, frequency, date");
        setIncomeRecords(incRows || []);
        const { data: expRows } = await supabase
          .from("expense_records")
          .select("amount, category, date");
        setExpenseRecords(expRows || []);
        // Build chart data for last 12 months
        const now = new Date();
        const months = [];
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push({
            month: d.toLocaleString("default", {
              month: "short",
              year: "2-digit",
            }),
            income: 0,
            expenses: 0,
          });
        }
        normalizeIncome(incRows || []).forEach((r) => {
          if (!r.date) return;
          const d = new Date(r.date);
          const idx = months.findIndex((m) => {
            const md = new Date(
              now.getFullYear(),
              now.getMonth() - (11 - months.indexOf(m)),
              1
            );
            return (
              d.getFullYear() === md.getFullYear() &&
              d.getMonth() === md.getMonth()
            );
          });
          if (idx >= 0) months[idx].income += r.monthly_amount;
        });
        (expRows || []).forEach((r) => {
          if (!r.date) return;
          const d = new Date(r.date);
          const idx = months.findIndex((m) => {
            const md = new Date(
              now.getFullYear(),
              now.getMonth() - (11 - months.indexOf(m)),
              1
            );
            return (
              d.getFullYear() === md.getFullYear() &&
              d.getMonth() === md.getMonth()
            );
          });
          if (idx >= 0) months[idx].expenses += Number(r.amount || 0);
        });
        setChartData(months);
      } catch (err) {
        notifyError("Failed to refresh chart data");
      } finally {
        setLoading(false);
      }
    } catch (err) {
      notifyError("Save failed");
      setLoading(false);
    }
  };

  const savings =
    Number(form.monthly_income || 0) - Number(form.monthly_expenses || 0);
  const savingsRate = Number(form.monthly_income || 0)
    ? ((savings / Number(form.monthly_income)) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="w-full md:w-2/3">
          <h3 className="font-semibold mb-2">
            Income vs Expenses (Last 12 Months)
          </h3>
          <div
            className="bg-white rounded shadow p-4"
            data-testid="chart-income-expenses"
          >
            {loading ? (
              <div className="animate-pulse h-[220px] w-full bg-gray-100 rounded" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={chartData.map((row) => ({
                    ...row,
                    savings: row.income - row.expenses,
                  }))}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={formatINR} />
                  <Bar dataKey="income" fill="#388e3c" name="Income" />
                  <Bar dataKey="expenses" fill="#d32f2f" name="Expenses" />
                  <Bar dataKey="savings" fill="#1976d2" name="Savings" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
          {loading ? (
            <div className="w-full flex flex-col gap-2 animate-pulse">
              <div className="h-6 bg-gray-100 rounded w-2/3 mx-auto" />
              <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto" />
              <div className="h-10 bg-gray-100 rounded w-full mt-4" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 mb-4 w-full">
                <div>
                  <div className="text-xs text-gray-500">Monthly Income</div>
                  <div
                    className="font-semibold text-lg"
                    data-testid="total-income"
                  >
                    {formatINR(form.monthly_income)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Monthly Expenses</div>
                  <div
                    className="font-semibold text-lg"
                    data-testid="total-expenses"
                  >
                    {formatINR(form.monthly_expenses)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Savings per Month</div>
                  <div
                    className="font-semibold text-lg"
                    data-testid="savings-per-month"
                  >
                    {formatINR(savings)}
                  </div>
                </div>
              </div>
              <div className="text-md font-medium mt-2">
                Savings Rate: {savingsRate}%
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <label className="text-sm">Monthly Income</label>
                <input
                  type="number"
                  value={form.monthly_income}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, monthly_income: e.target.value }))
                  }
                  className="border rounded px-2"
                  data-testid="input-monthly-income"
                />
                <label className="text-sm">Monthly Expenses</label>
                <input
                  type="number"
                  value={form.monthly_expenses}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, monthly_expenses: e.target.value }))
                  }
                  className="border rounded px-2"
                  data-testid="input-monthly-expenses"
                />
                <button
                  className="bg-blue-600 text-white rounded px-4 py-1 mt-2"
                  onClick={handleSave}
                  data-testid="btn-save-cashflow"
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Table of monthly cashflow */}
      <div className="mt-6">
        <table className="w-full text-sm" data-testid="cashflow-table">
          <thead>
            <tr className="bg-gray-50">
              <th>Month</th>
              <th>Income</th>
              <th>Expenses</th>
              <th>Savings</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row) => (
              <tr key={row.month} className="border-b">
                <td>{row.month}</td>
                <td>{formatINR(row.income)}</td>
                <td>{formatINR(row.expenses)}</td>
                <td>{formatINR(row.income - row.expenses)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
