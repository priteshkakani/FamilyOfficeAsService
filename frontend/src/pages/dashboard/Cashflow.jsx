import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useClientData from "../../hooks/useClientData";
import DataTable from "../../components/dashboard/DataTable";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Cashflow() {
  const { clientId: userId } = useParams();
  const { loading, views, error } = useClientData(userId);

  // Mock expenses for now; replace with Supabase fetch
  const [expenses, setExpenses] = useState([
    { month: "Jan", expense: 25000 },
    { month: "Feb", expense: 22000 },
    { month: "Mar", expense: 27000 },
  ]);

  const income = views?.cashflow || [
    { month: "Jan", income: 40000 },
    { month: "Feb", income: 42000 },
    { month: "Mar", income: 41000 },
  ];

  // CRUD handlers (mock)
  const [newIncome, setNewIncome] = useState("");
  const [newExpense, setNewExpense] = useState("");
  const [newMonth, setNewMonth] = useState("");

  const handleAddRecord = () => {
    if (!newMonth) return;
    if (newIncome) {
      income.push({ month: newMonth, income: Number(newIncome) });
    }
    if (newExpense) {
      setExpenses([
        ...expenses,
        { month: newMonth, expense: Number(newExpense) },
      ]);
    }
    setNewMonth("");
    setNewIncome("");
    setNewExpense("");
  };

  const handleDeleteExpense = (idx) => {
    setExpenses(expenses.filter((_, i) => i !== idx));
  };

  // Chart data
  const months = Array.from(
    new Set([...income.map((i) => i.month), ...expenses.map((e) => e.month)])
  );
  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: months.map((m) => income.find((i) => i.month === m)?.income || 0),
        backgroundColor: "#4ade80",
      },
      {
        label: "Expenses",
        data: months.map(
          (m) => expenses.find((e) => e.month === m)?.expense || 0
        ),
        backgroundColor: "#f87171",
      },
    ],
  };

  const colsIncome = [
    { key: "month", title: "Month" },
    {
      key: "income",
      title: "Income",
      render: (r) =>
        `₹${Number(r.income || r.total_income || 0).toLocaleString("en-IN")}`,
    },
  ];
  const colsExpense = [
    { key: "month", title: "Month" },
    {
      key: "expense",
      title: "Expense",
      render: (r) => `₹${Number(r.expense || 0).toLocaleString("en-IN")}`,
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, idx) => (
        <button
          aria-label="Delete expense"
          className="text-red-500 hover:underline ml-2"
          onClick={() => handleDeleteExpense(idx)}
          data-testid={`delete-expense-${idx}`}
        >
          Delete
        </button>
      ),
    },
  ];

  if (loading)
    return (
      <div data-testid="cashflow-loading" aria-busy="true">
        Loading cashflow…
      </div>
    );
  if (error)
    return (
      <div data-testid="cashflow-error" role="alert">
        Error loading cashflow
      </div>
    );

  return (
    <div data-testid="cashflow-page" className="p-4">
      <h2 className="text-xl font-semibold mb-4">Cashflow</h2>
      <div className="mb-6">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Income vs Expenses" },
            },
            scales: {
              y: { beginAtZero: true },
            },
          }}
          data-testid="cashflow-chart"
        />
      </div>
      <form
        className="flex flex-wrap gap-2 mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddRecord();
        }}
        aria-label="Add cashflow record"
        data-testid="cashflow-form"
      >
        <input
          type="text"
          placeholder="Month (e.g. Apr)"
          value={newMonth}
          onChange={(e) => setNewMonth(e.target.value)}
          className="border rounded px-2 py-1"
          aria-label="Month"
          required
        />
        <input
          type="number"
          placeholder="Income"
          value={newIncome}
          onChange={(e) => setNewIncome(e.target.value)}
          className="border rounded px-2 py-1"
          aria-label="Income"
        />
        <input
          type="number"
          placeholder="Expense"
          value={newExpense}
          onChange={(e) => setNewExpense(e.target.value)}
          className="border rounded px-2 py-1"
          aria-label="Expense"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-1 rounded"
          aria-label="Add record"
          data-testid="add-cashflow-record"
        >
          Add
        </button>
      </form>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          columns={colsIncome}
          rows={income}
          dataTestId="cashflow-income-table"
        />
        <DataTable
          columns={colsExpense}
          rows={expenses}
          dataTestId="cashflow-expense-table"
        />
      </div>
    </div>
  );
}
