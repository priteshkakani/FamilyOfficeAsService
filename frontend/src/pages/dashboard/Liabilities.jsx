import React from "react";

export default function Liabilities() {
  return <div data-testid="page-liabilities">Liabilities page (placeholder)</div>;
}
import React from "react";
import { useClient } from "../../hooks/useClientContext";
import useClientData from "../../hooks/useClientData";
import DataTable from "../../components/dashboard/DataTable";

export default function Liabilities() {
  const { selectedClient } = useClient();
  const { loading, profile, views } = useClientData(selectedClient);

  // For now fetch liabilities directly
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    let mounted = true;
    async function load() {
      if (!selectedClient) return;
      const { data, error } = await (
        await import("../../supabaseClient")
      ).supabase
        .from("liabilities")
        .select("*")
        .eq("user_id", selectedClient);
      if (error) console.error(error);
      if (mounted) setRows(data || []);
    }
    load();
    return () => (mounted = false);
  }, [selectedClient]);

  const cols = [
    { key: "type", title: "Type" },
    { key: "institution", title: "Institution" },
    {
      key: "outstanding_amount",
      title: "Outstanding",
      render: (r) =>
        `₹${Number(r.outstanding_amount || 0).toLocaleString("en-IN")}`,
    },
    {
      key: "emi_amount",
      title: "EMI",
      render: (r) => `₹${Number(r.emi_amount || 0).toLocaleString("en-IN")}`,
    },
  ];

  return (
    <div data-testid="liabilities-page">
      <h2 className="text-xl font-semibold mb-4">Liabilities</h2>
      <DataTable columns={cols} rows={rows} dataTestId="liabilities-table" />
    </div>
  );
}
