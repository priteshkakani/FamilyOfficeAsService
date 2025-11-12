import React, { useState } from "react";
import { useClient } from "../../hooks/useClientContext";
import { supabase } from "../../supabaseClient";

export default function Audit() {
  const { selectedClient } = useClient();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [drawer, setDrawer] = useState(null);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        if (!selectedClient) return;
        const { data, error } = await supabase
          .from("vw_activity_feed")
          .select("*")
          .eq("user_id", selectedClient)
          .order("created_at", { ascending: false })
          .limit(200);
        if (error) throw error;
        if (mounted) setRows(data || []);
      } catch (e) {
        setError("Failed to load activity feed");
      }
      setLoading(false);
    }
    load();
    return () => (mounted = false);
  }, [selectedClient]);

  // Filter rows
  const filteredRows = filter
    ? rows.filter(
        (r) =>
          r.action?.toLowerCase().includes(filter.toLowerCase()) ||
          r.entity?.toLowerCase().includes(filter.toLowerCase())
      )
    : rows;

  // Export CSV
  const handleExport = () => {
    const csv = ["Action,Entity,Meta,Created At"]
      .concat(
        filteredRows.map((r) =>
          [r.action, r.entity, JSON.stringify(r.meta), r.created_at]
            .map((v) => `"${v}"`)
            .join(",")
        )
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "activity_feed.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading)
    return (
      <div data-testid="audit-loading" aria-busy="true">
        Loading activity feed…
      </div>
    );
  if (error)
    return (
      <div data-testid="audit-error" role="alert">
        {error}
      </div>
    );

  return (
    <div data-testid="audit-page" className="p-4">
      <h2 className="text-xl font-semibold mb-4">Audit & Activity</h2>
      <div className="mb-4 flex gap-2 items-center">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by action/entity"
          className="border rounded px-2 py-1"
          aria-label="Filter activity feed"
          data-testid="audit-filter"
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handleExport}
          aria-label="Export CSV"
          data-testid="audit-export"
        >
          Export CSV
        </button>
      </div>
      <div className="space-y-2">
        {filteredRows.length === 0 && (
          <div className="text-gray-500" data-testid="audit-empty">
            No activity found.
          </div>
        )}
        {filteredRows.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl shadow p-3 cursor-pointer"
            onClick={() => setDrawer(r)}
            data-testid={`audit-row-${r.id}`}
            tabIndex={0}
            aria-label={`View details for ${r.action} on ${r.entity}`}
          >
            <div className="text-sm font-medium">
              {r.action}{" "}
              <span className="text-xs text-gray-400">on {r.entity}</span>
            </div>
            <div className="text-xs text-gray-500">
              {typeof r.meta === "string" ? r.meta : JSON.stringify(r.meta)}
            </div>
            <div className="text-xs text-gray-400">{r.created_at}</div>
          </div>
        ))}
      </div>
      {/* Details drawer */}
      {drawer && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          data-testid="audit-drawer"
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 mx-4 relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setDrawer(null)}
              aria-label="Close details"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-2">Activity Details</h3>
            <div>
              <strong>Action:</strong> {drawer.action}
            </div>
            <div>
              <strong>Entity:</strong> {drawer.entity}
            </div>
            <div>
              <strong>Meta:</strong>{" "}
              {typeof drawer.meta === "string"
                ? drawer.meta
                : JSON.stringify(drawer.meta, null, 2)}
            </div>
            <div>
              <strong>Created At:</strong> {drawer.created_at}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
