import React from "react";
import { useClient } from "../../contexts/ClientContext";
import useClientData from "../../hooks/useClientData";
import GoalModal from "../../components/dashboard/GoalModal";

export default function Goals() {
  const { client } = useClient();
  const userId = client?.id;
  const { loading, goals } = useClientData(userId);
  const [openGoal, setOpenGoal] = React.useState(false);
  const [goalPayload, setGoalPayload] = React.useState(null);

  if (loading) return <div data-testid="goals-loading">Loading goals…</div>;

  return (
    <div data-testid="goals-page">
      <h2 className="text-xl font-semibold mb-4">Goals</h2>
      <div className="mb-4">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={() => setOpenGoal(true)}
          data-testid="add-goal-btn"
        >
          Add Goal
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(goals || []).map((g) => (
          <div key={g.id} className="bg-white rounded-xl shadow p-4">
            <div className="font-semibold">{g.title}</div>
            <div className="text-sm text-gray-500">
              Target: ₹{Number(g.target_amount || 0).toLocaleString("en-IN")}
            </div>
            <div className="text-xs mt-2">{g.notes}</div>
          </div>
        ))}
      </div>

      <GoalModal
        open={openGoal}
        onClose={(saved) => {
          setOpenGoal(false);
          setGoalPayload(null);
          if (saved) window.dispatchEvent(new Event("refresh-client-data"));
        }}
        clientId={userId}
        goal={goalPayload}
      />
    </div>
  );
}
