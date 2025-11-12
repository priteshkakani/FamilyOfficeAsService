import React, { useMemo, useState } from "react";
import { exportToCsv } from "../../utils/exportCsv";

export default function DataTableWithPagination({
  columns = [],
  rows = [],
  dataTestId,
}) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filter, setFilter] = useState("");

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (!filter) return true;
        const q = filter.toLowerCase();
        return Object.values(r).some((v) =>
          ("" + (v || "")).toLowerCase().includes(q)
        );
      }),
    [rows, filter]
  );

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="bg-white rounded-xl shadow-md p-4" data-testid={dataTestId}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <input
            placeholder="Filter..."
            className="border px-2 py-1 rounded"
            value={filter}
            onChange={(e) => {
              setPage(1);
              setFilter(e.target.value);
            }}
            data-testid="table-filter"
          />
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border px-2 py-1 rounded"
            data-testid="table-perpage"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 bg-gray-100 rounded"
            onClick={() => exportToCsv("export.csv", filtered)}
            data-testid="export-csv"
          >
            Export CSV
          </button>
        </div>
      </div>
      <table className="min-w-full text-sm">
        <thead className="text-left text-xs text-gray-500 border-b">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="py-2 px-2">
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageRows.map((r, i) => (
            <tr key={i} className="border-b last:border-b-0">
              {columns.map((c) => (
                <td key={c.key} className="py-3 px-2">
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {(page - 1) * perPage + 1} - {Math.min(page * perPage, total)}{" "}
          of {total}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            data-testid="page-prev"
          >
            Prev
          </button>
          <div className="px-3 py-1">
            {page}/{pages}
          </div>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => setPage((p) => Math.min(p + 1, pages))}
            disabled={page >= pages}
            data-testid="page-next"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
