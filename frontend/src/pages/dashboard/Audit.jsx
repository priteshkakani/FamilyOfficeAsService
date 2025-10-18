import React from "react";
import { useClient } from "../../contexts/ClientContext";
import useClientData from "../../hooks/useClientData";

export default function Audit() {
  const { client } = useClient();
  const userId = client?.id;
  // Reuse consents state for now; in a full impl we would fetch audit_log
  const { loading } = useClientData(userId);

  if (loading) return <div data-testid="audit-loading">Loading…</div>;

  return (
    <div data-testid="audit-page">
      <h2 className="text-xl font-semibold mb-4">Audit & Activity</h2>
      <div className="text-sm text-gray-500">Audit list not implemented in mock environment.</div>
    </div>
  );
}
import React from "react";

export default function Audit() {
  return <div data-testid="page-audit">Audit & Activity (placeholder)</div>;
}
import React from "react";
import { useClient } from "../../hooks/useClientContext";
import useClientData from "../../hooks/useClientData";

export default function Audit() {
  const { selectedClient } = useClient();
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      if (!selectedClient) return;
      const { data, error } = await (
        await import("../../supabaseClient")
      ).supabase
        .from("audit_log")
        .select("*")
        .eq("user_id", selectedClient)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) console.error(error);
      if (mounted) setRows(data || []);
    }
    load();
    return () => (mounted = false);
  }, [selectedClient]);

  return (
    <div data-testid="audit-page">
      <h2 className="text-xl font-semibold mb-4">Audit & Activity</h2>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.id} className="bg-white rounded-xl shadow p-3">
            <div className="text-sm font-medium">
              {r.action}{" "}
              <span className="text-xs text-gray-400">on {r.entity}</span>
            </div>
            <div className="text-xs text-gray-500">{r.meta}</div>
            <div className="text-xs text-gray-400">{r.created_at}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
