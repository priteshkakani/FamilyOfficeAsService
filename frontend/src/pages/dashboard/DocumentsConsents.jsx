import React from "react";
import { useClient } from "../../contexts/ClientContext";
import useClientData from "../../hooks/useClientData";

export default function DocumentsConsents() {
  const { client } = useClient();
  const userId = client?.id;
  const { loading, consents } = useClientData(userId);

  if (loading) return <div data-testid="documents-loading">Loading…</div>;

  return (
    <div data-testid="documents-page">
      <h2 className="text-xl font-semibold mb-4">Documents & Consents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(consents || []).map((c) => (
          <div key={c.id} className="bg-white rounded-xl shadow p-4" data-testid={`consent-${c.id}`}>
            <div className="font-semibold">{c.source || c.identifier}</div>
            <div className="text-xs text-gray-500">Status: {c.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
import React from "react";

export default function DocumentsConsents() {
  return <div data-testid="page-documents">Documents & Consents (placeholder)</div>;
}
import React from "react";
import { useClient } from "../../hooks/useClientContext";
import useClientData from "../../hooks/useClientData";

export default function DocumentsConsents() {
  const { selectedClient } = useClient();
  const { loading, consents } = useClientData(selectedClient);

  return (
    <div data-testid="documents-page">
      <h2 className="text-xl font-semibold mb-4">Documents & Consents</h2>
      <div className="space-y-3">
        {(consents || []).map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{c.source}</div>
              <div className="text-xs text-gray-500">{c.identifier}</div>
            </div>
            <div>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  c.status === "connected"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {c.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
