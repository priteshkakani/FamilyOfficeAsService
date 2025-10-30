import React, { useState } from "react";
import formatINR from "../../utils/formatINR";
import { useClient } from "../../hooks/useClientContext";
import useClientData from "../../hooks/useClientData";
import KpiCard from "../../components/dashboard/KpiCard";
import IncomeExpenseChart from "../../components/dashboard/IncomeExpenseChart";
import AssetAllocationDonut from "../../components/dashboard/AssetAllocationDonut";

export default function Overview() {
  const { client } = useClient();
  const userId = client?.id;
  const { loading, profile, views, goals, refresh } = useClientData(userId);

  const netWorth = views?.netWorth?.net_worth || profile?.net_worth || 0;
  // monthlyCashflow view entries may carry total_income/total_expenses per month
  const monthlyCashflow = views?.cashflow || [];
  const assetAllocation = views?.allocation || [];

  // Use monthly_income_details if present
  const monthlyIncomeDetails = profile?.monthly_income_details || {};
  const [incomeInput, setIncomeInput] = useState(
    monthlyIncomeDetails.income || ""
  );
  const [expenseInput, setExpenseInput] = useState(
    monthlyIncomeDetails.expense || ""
  );
  const monthlyIncome = Number(incomeInput || 0);
  const monthlyExpenses = Number(expenseInput || 0);
  const savingsRate = monthlyIncome
    ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)
    : 0;

  // Save handler
  const handleSaveIncomeExpense = async () => {
    if (!userId) return;
    const payload = {
      monthly_income_details: {
        income: Number(incomeInput || 0),
        expense: Number(expenseInput || 0),
      },
    };
    await fetch(`/api/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, ...payload }),
    });
    refresh && refresh();
  };

  return (
    <div data-testid="overview-page" className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              {profile?.full_name || "Select client"}
            </h2>
            <div className="text-sm opacity-80">
              Last updated: {views?.netWorth?.as_of_date || "—"}
            </div>
          </div>
          <div>
            <button
              onClick={refresh}
              className="bg-white text-blue-600 px-4 py-2 rounded"
              data-testid="overview-refresh"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center py-8">
        <form
          className="bg-white rounded-xl shadow-lg px-8 py-6 flex flex-col items-center w-full max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveIncomeExpense();
          }}
        >
          <h3 className="text-xl font-semibold mb-6">Income & Expenses</h3>
          <div className="flex flex-row gap-6 w-full justify-center">
            <div className="flex flex-col items-start">
              <label className="mb-2 font-medium text-gray-700">
                Monthly Income
              </label>
              <input
                type="number"
                value={incomeInput}
                min={0}
                onChange={(e) => setIncomeInput(e.target.value)}
                className="border rounded px-4 py-2 w-40 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col items-start">
              <label className="mb-2 font-medium text-gray-700">
                Monthly Expenses
              </label>
              <input
                type="number"
                value={expenseInput}
                min={0}
                onChange={(e) => setExpenseInput(e.target.value)}
                className="border rounded px-4 py-2 w-40 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col items-start">
              <label className="mb-2 font-medium text-gray-700">
                Savings Rate
              </label>
              <input
                type="text"
                value={`${savingsRate}%`}
                readOnly
                className="border rounded px-4 py-2 w-32 text-right bg-gray-50 text-gray-700"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            Save Income & Expense
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncomeExpenseChart data={monthlyCashflow || []} />
        </div>
        <div>
          <AssetAllocationDonut data={assetAllocation || []} />
          <div className="mt-4 bg-white rounded-xl shadow p-4">
            <h4 className="text-md font-medium mb-2">Upcoming Goals</h4>
            <ul className="space-y-2" data-testid="upcoming-goals">
              {(goals || [])
                .filter((g) => !g.is_completed)
                .slice(0, 5)
                .map((g) => (
                  <li key={g.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{g.title}</div>
                      <div className="text-xs text-gray-500">
                        Target: {formatINR(g.target_amount)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">{g.target_date}</div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
