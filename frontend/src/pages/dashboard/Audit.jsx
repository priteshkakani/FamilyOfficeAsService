import React from "react";
import { useClient } from "../../hooks/useClientContext";
import { supabase } from "../../supabaseClient";

export default function Audit() {
  const { selectedClient } = useClient();
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      if (!selectedClient) return;
      const { data, error } = await supabase
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
