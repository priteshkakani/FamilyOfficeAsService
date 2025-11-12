import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

// Expect data = [{ month: '2025-01', income: 10000, expenses: 8000 }, ...]
export default function IncomeExpenseChart({ data = [] }) {
  const normalized = (data || []).map((d) => ({
    month: d.month || d.label || "—",
    income: Number(d.income || d.total_income || 0),
    expenses: Number(d.expenses || d.total_expenses || 0),
  }));

  return (
    <div
      className="bg-white rounded-xl shadow-md p-4"
      data-testid="income-expense-chart"
    >
      <h3 className="text-lg font-semibold mb-3">Income vs Expenses</h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={normalized}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#2563eb" />
            <Bar dataKey="expenses" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
