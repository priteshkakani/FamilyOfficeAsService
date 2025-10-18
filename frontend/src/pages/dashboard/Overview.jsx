import React from "react";
import { useClient } from "../../contexts/ClientContext";
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

  const monthlyIncome =
    profile?.monthly_income ||
    (monthlyCashflow.length
      ? monthlyCashflow.reduce(
          (s, m) => s + Number(m.total_income || m.income || 0),
          0
        ) / monthlyCashflow.length
      : 0);
  const monthlyExpenses =
    profile?.monthly_expenses ||
    (monthlyCashflow.length
      ? monthlyCashflow.reduce(
          (s, m) => s + Number(m.total_expenses || m.expenses || 0),
          0
        ) / monthlyCashflow.length
      : 0);
  const savingsRate = monthlyIncome
    ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)
    : 0;

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard
          title="Net Worth"
          value={Number(netWorth || 0)}
          testid="kpi-networth"
        />
        <KpiCard
          title="Monthly Income"
          value={Number(monthlyIncome || 0)}
          testid="kpi-income"
        />
        <KpiCard
          title="Monthly Expenses"
          value={Number(monthlyExpenses || 0)}
          testid="kpi-expenses"
        />
        <KpiCard
          title="Savings Rate"
          value={`${savingsRate}%`}
          testid="kpi-savings"
        />
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
                        Target: ₹
                        {Number(g.target_amount || 0).toLocaleString("en-IN")}
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
