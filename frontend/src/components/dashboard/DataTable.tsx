import React from "react";

export default function DataTable({ columns = [], rows = [], dataTestId }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4" data-testid={dataTestId}>
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
          {rows.map((r, i) => (
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
    </div>
  );
}
