import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { notifyError } from "../../utils/toast";

const PAGE_SIZE = 20;
const ENTITIES = [
  "notes",
  "mandates",
  "mf_transactions",
  "stock_trades",
  "insurance_policies",
];

export default function AuditPanel({ userId }) {
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [entity, setEntity] = useState("");
  const [date, setDate] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let query = supabase.from("vw_activity_feed").select("*");
        if (entity) query = query.eq("entity_type", entity);
        if (date) query = query.gte("created_at", date);
        query = query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
        const { data: rows, error, count } = await query;
        if (error) throw error;
        setFeed(rows || []);
        setTotal(count || 0);
      } catch (err) {
        notifyError("Failed to load audit feed");
      } finally {
        setLoading(false);
      }
    })();
  }, [entity, date, page, userId]);

  const handleExportCSV = () => {
    const csv = ["entity_type,description,created_at"]
      .concat(
        feed.map((row) =>
          [row.entity_type, row.description, row.created_at].join(",")
        )
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit_feed.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold mb-2">Audit Feed</h3>
      <div className="flex gap-4 mb-4">
        <select
          value={entity}
          onChange={(e) => setEntity(e.target.value)}
          className="border rounded px-2"
        >
          <option value="">All Entities</option>
          {ENTITIES.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-2"
        />
        <button
          className="bg-blue-600 text-white rounded px-4 py-1"
          onClick={handleExportCSV}
        >
          Export CSV
        </button>
      </div>
      <table className="w-full text-sm" data-testid="audit-feed">
        <thead>
          <tr className="bg-gray-50">
            <th>Entity</th>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {feed.map((row, i) => (
            <tr key={i} className="border-b">
              <td>{row.entity_type}</td>
              <td>{row.description}</td>
              <td>{row.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2 mt-4">
        <button
          className="px-3 py-1 border rounded"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <span>
          Page {page} / {Math.ceil(total / PAGE_SIZE) || 1}
        </span>
        <button
          className="px-3 py-1 border rounded"
          disabled={page * PAGE_SIZE >= total}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
