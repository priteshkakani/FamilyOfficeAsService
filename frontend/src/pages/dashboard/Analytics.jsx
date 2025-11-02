import React, { useEffect, useState } from "react";
import { useClient } from "../../hooks/useClientContext";
import { supabase } from "../../supabaseClient";

export default function Analytics() {
  const { selectedClient } = useClient();
  const [allocation, setAllocation] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [netWorth, setNetWorth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const { data: alloc, error: allocErr } = await supabase
          .from("vw_asset_allocation")
          .select("*")
          .eq("user_id", selectedClient);
        const { data: liab, error: liabErr } = await supabase
          .from("liabilities")
          .select("*")
          .eq("user_id", selectedClient);
        const { data: net, error: netErr } = await supabase
          .from("vw_net_worth")
          .select("*")
          .eq("user_id", selectedClient);
        if (allocErr || liabErr || netErr) throw allocErr || liabErr || netErr;
        setAllocation(alloc || []);
        setLiabilities(liab || []);
        setNetWorth(net || []);
      } catch (err) {
        setError("Failed to load analytics data");
      }
      setLoading(false);
    }
    if (selectedClient) fetchData();
  }, [selectedClient]);

  if (loading)
    return <div data-testid="analytics-loading">Loading analytics…</div>;
  if (error)
    return (
      <div className="text-red-600 mb-2" role="alert">
        {error}
      </div>
    );

  // Placeholder chart components
  return (
    <div data-testid="analytics-page">
      <h2 className="text-xl font-semibold mb-4">Portfolio Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-bold mb-2">Allocation Donut</h3>
          {/* Replace with chart lib */}
          <pre>{JSON.stringify(allocation, null, 2)}</pre>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-bold mb-2">Liability Breakdown</h3>
          <pre>{JSON.stringify(liabilities, null, 2)}</pre>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-bold mb-2">Net Worth Trend</h3>
          <pre>{JSON.stringify(netWorth, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
