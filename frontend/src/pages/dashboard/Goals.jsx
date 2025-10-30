import React from "react";
import { toast } from "react-hot-toast";
import formatINR from "../../utils/formatINR";
import { useClient } from "../../hooks/useClientContext";
import useClientData from "../../hooks/useClientData";
import GoalModal from "../../components/dashboard/GoalModal";

export default function Goals() {
  const { client } = useClient();
  const userId = client?.id;
  const { loading, goals, refresh } = useClientData(userId);
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
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        data-testid="goals-list"
      >
        {(goals || []).map((g) => (
          <div key={g.id} className="bg-white rounded-xl shadow p-4">
            <div className="font-semibold">
              {typeof g.title === "string"
                ? g.title
                : g.title
                ? JSON.stringify(g.title)
                : ""}
            </div>
            <div className="text-sm text-gray-500">
              Target: {formatINR(g.target_amount)}
            </div>
            <div className="text-xs mt-2">
              {typeof g.notes === "string"
                ? g.notes
                : g.notes
                ? JSON.stringify(g.notes)
                : ""}
            </div>
          </div>
        ))}
      </div>

      <GoalModal
        open={openGoal}
        onClose={(saved) => {
          setOpenGoal(false);
          setGoalPayload(null);
          if (saved) {
            toast.success("Goal saved");
            refresh && refresh();
          }
        }}
        clientId={userId}
        goal={goalPayload}
        data-testid="goal-save"
      />
    </div>
  );
}
