import React from "react";
import { useClient } from "../../contexts/ClientContext";
import useClientData from "../../hooks/useClientData";
import DataTable from "../../components/dashboard/DataTable";

export default function Cashflow() {
  const { client } = useClient();
  const userId = client?.id;
  const { loading, views } = useClientData(userId);

  const income = views?.cashflow || [];
  const expenses = [];

  const colsIncome = [
    { key: "month", title: "Month" },
    {
      key: "income",
      title: "Income",
      render: (r) =>
        `₹${Number(r.income || r.total_income || 0).toLocaleString("en-IN")}`,
    },
  ];

  if (loading)
    return <div data-testid="cashflow-loading">Loading cashflow…</div>;

  return (
    <div data-testid="cashflow-page">
      <h2 className="text-xl font-semibold mb-4">Cashflow</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          columns={colsIncome}
          rows={income}
          dataTestId="cashflow-income-table"
        />
        <DataTable
          columns={colsIncome}
          rows={expenses}
          dataTestId="cashflow-expense-table"
        />
      </div>
    </div>
  );
}
