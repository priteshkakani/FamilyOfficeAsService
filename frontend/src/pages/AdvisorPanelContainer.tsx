import React from "react";
import { useAuth } from "../contexts/AuthProvider";
import EntityFormPanel from "../components/dashboard/EntityFormPanel";

export default function AdvisorPanelContainer({
  selectedEntity,
  selectedRowId,
}: {
  selectedEntity: string;
  selectedRowId?: string;
}) {
  const { user } = useAuth();
  const userId = user?.id;

  if (!userId) {
    return (
      <div
        className="bg-white rounded-lg shadow p-6 mt-6 text-center"
        data-testid="advisor-panel-unauthorized"
      >
        <div className="text-lg font-bold mb-2">
          Please sign in to continue
        </div>
        <div className="text-gray-500">
          You need to be signed in to access this feature.
        </div>
      </div>
    );
  }

  if (!selectedEntity) {
    return (
      <div
        className="bg-white rounded-lg shadow p-6 mt-6 text-center"
        data-testid="advisor-panel-empty"
      >
        <div className="text-lg font-bold mb-2">
          Select an entity to continue
        </div>
        <div className="text-gray-500">
          Use the navigation to select an entity to view or edit.
        </div>
      </div>
    );
  }

  // Render entity panel for the current user
  return (
    <div className="mt-6" data-testid={`advisor-panel-${selectedEntity}`}>
      <EntityFormPanel
        entity={selectedEntity}
        userId={userId}
        rowId={selectedRowId}
        onClose={() => {}}
      />
    </div>
  );
}
