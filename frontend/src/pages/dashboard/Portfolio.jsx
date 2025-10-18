import React from "react";
import { useClient } from "../../contexts/ClientContext";
import useClientData from "../../hooks/useClientData";
import DataTable from "../../components/dashboard/DataTable";

export default function Portfolio() {
  const { client } = useClient();
  const userId = client?.id;
  const { loading, views } = useClientData(userId);

  const assets = views?.allocation || [];

  const columns = [
    { key: "category", title: "Category" },
    {
      key: "value",
      title: "Value",
      render: (r) => `₹${Number(r.value || 0).toLocaleString("en-IN")}`,
    },
  ];

  if (loading)
    return <div data-testid="portfolio-loading">Loading portfolio…</div>;

  return (
    <div data-testid="portfolio-page">
      <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
      <DataTable columns={columns} rows={assets} dataTestId="portfolio-table" />
    </div>
  );
}
