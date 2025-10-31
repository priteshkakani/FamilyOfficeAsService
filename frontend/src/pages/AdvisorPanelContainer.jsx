import React from "react";
import { useAdvisorClient } from "../contexts/AdvisorClientContext";
import EntityFormPanel from "../components/dashboard/EntityFormPanel";

export default function AdvisorPanelContainer({
  selectedEntity,
  selectedRowId,
}) {
  const { clientId, clientMeta, loading, error } = useAdvisorClient();

  if (!clientId) {
    return (
      <div
        className="bg-white rounded-lg shadow p-6 mt-6 text-center"
        data-testid="advisor-panel-empty"
      >
        <div className="text-lg font-bold mb-2">
          Select a client to continue
        </div>
        <div className="text-gray-500">
          Use the picker above to search and select a client.
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div
        className="bg-white rounded-lg shadow p-6 mt-6 text-center"
        data-testid="advisor-panel-loading"
      >
        Loading client data…
      </div>
    );
  }
  if (error) {
    return (
      <div
        className="bg-white rounded-lg shadow p-6 mt-6 text-center text-red-600"
        data-testid="advisor-panel-error"
      >
        {error}
      </div>
    );
  }
  if (!clientMeta) {
    return (
      <div
        className="bg-white rounded-lg shadow p-6 mt-6 text-center text-red-600"
        data-testid="advisor-panel-notfound"
      >
        Client not found. Please select another.
      </div>
    );
  }
  // Render entity panel for selected client
  return (
    <div className="mt-6" data-testid={`advisor-panel-${selectedEntity}`}>
      <EntityFormPanel
        entity={selectedEntity}
        userId={clientId}
        rowId={selectedRowId}
        onClose={() => {}}
      />
    </div>
  );
}
