import React, { useCallback } from "react";
import { toast } from "react-hot-toast";
import formatINR from "../../utils/formatINR";
import { useClient } from "../../hooks/useClientContext";
import useClientData from "../../hooks/useClientData";
import { useGoals } from "../../hooks/useGoals";
import GoalModal from "../../components/dashboard/GoalModal";

interface GoalPayload {
  id?: string;
  title: string;
  description?: string;
  target_amount?: number;
  target_date?: string;
  priority: 'low' | 'medium' | 'high';
  progress?: number;
}

export default function Goals() {
  const { selectedClient } = useClient();
  const userId = selectedClient;
  const { loading, goals = [], refresh } = useClientData(userId);
  const { 
    createGoal, 
    updateGoal, 
    deleteGoal 
  } = useGoals();
  
  const [openGoal, setOpenGoal] = React.useState(false);
  const [editingGoal, setEditingGoal] = React.useState<GoalPayload | null>(null);
  const [sortBy, setSortBy] = React.useState("upcoming");
  const [page, setPage] = React.useState(1);
  const pageSize = 6;
  const [error, setError] = React.useState("");
  
  const isLoading = loading || createGoal.isLoading || updateGoal.isLoading || deleteGoal.isLoading;

  // Sort goals
  const sortedGoals = [...goals].sort((a, b) => {
    if (sortBy === "upcoming") {
      return new Date(a.target_date) - new Date(b.target_date);
    }
    if (sortBy === "priority") {
      const prio = { high: 0, medium: 1, low: 2 };
      return prio[a.priority] - prio[b.priority];
    }
    if (sortBy === "progress") {
      return (b.progress || 0) - (a.progress || 0);
    }
    return 0;
  });
  // Pagination
  const pagedGoals = sortedGoals.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(sortedGoals.length / pageSize);

  // Handle form submission
  const handleSubmit = useCallback(async (goalData: GoalPayload) => {
    setError("");
    try {
      if (editingGoal?.id) {
        await updateGoal.mutate({
          id: editingGoal.id,
          updates: goalData
        });
        toast.success("Goal updated successfully");
      } else {
        await createGoal.mutate(goalData);
        toast.success("Goal created successfully");
      }
      setOpenGoal(false);
      setEditingGoal(null);
      refresh();
    } catch (error) {
      console.error("Error saving goal:", error);
      setError(error.message || "Failed to save goal");
    }
  }, [createGoal, updateGoal, editingGoal, refresh]);

  // Delete goal
  const handleDelete = useCallback(async (goalId: string) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    
    setError("");
    try {
      await deleteGoal.mutate(goalId);
      toast.success("Goal deleted");
      refresh();
    } catch (error) {
      console.error("Error deleting goal:", error);
      setError(error.message || "Failed to delete goal");
    }
  }, [deleteGoal, refresh]);
  
  // Open edit modal
  const handleEdit = useCallback((goal: GoalPayload) => {
    setEditingGoal(goal);
    setOpenGoal(true);
  }, []);

  if (isLoading && goals.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div data-testid="goals-page" className="p-4">
      <h2 className="text-xl font-semibold mb-4">Goals</h2>
      <div className="mb-4 flex gap-2 items-center">
        <button
          className={`px-3 py-1 bg-blue-600 text-white rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => {
            setEditingGoal(null);
            setOpenGoal(true);
          }}
          disabled={isLoading}
          data-testid="add-goal-btn"
          aria-label="Add goal"
        >
          {isLoading ? 'Saving...' : 'Add Goal'}
        </button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-2 py-1"
          aria-label="Sort goals"
          data-testid="goals-sort"
        >
          <option value="upcoming">Upcoming</option>
          <option value="priority">Priority</option>
          <option value="progress">Progress</option>
        </select>
      </div>
      {error && (
        <div
          className="text-red-600 mb-2"
          role="alert"
          data-testid="goals-error"
        >
          {error}
        </div>
      )}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        data-testid="goals-list"
      >
        {pagedGoals.length === 0 && (
          <div className="text-gray-500 col-span-3" data-testid="goals-empty">
            No goals added.
          </div>
        )}
        {pagedGoals.map((g) => (
          <div key={g.id} className="bg-white rounded-xl shadow p-4 relative">
            <div className="absolute top-2 right-2 flex gap-1">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => {
                  setGoalPayload(g);
                  setOpenGoal(true);
                }}
                aria-label={`Edit goal ${g.title}`}
                data-testid={`edit-goal-${g.id}`}
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:underline"
                onClick={() => handleDelete(g.id)}
                aria-label={`Delete goal ${g.title}`}
                data-testid={`delete-goal-${g.id}`}
              >
                Delete
              </button>
            </div>
            <div className="font-semibold">{g.title}</div>
            <div className="text-sm text-gray-500">
              Target: {formatINR(g.target_amount)}
            </div>
            <div className="text-xs mt-2">{g.notes}</div>
            <div className="mt-2">
              <span
                className={`inline-block px-2 py-1 rounded text-xs ${
                  g.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : g.priority === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {g.priority}
              </span>
            </div>
            {g.target_date && (
              <div className="text-xs text-gray-400 mt-1">
                Due: {g.target_date}
              </div>
            )}
            {/* Progress bar */}
            {typeof g.progress === "number" && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded h-2">
                  <div
                    className="bg-blue-500 h-2 rounded"
                    style={{
                      width: `${Math.min(100, Math.max(0, g.progress))}%`,
                    }}
                    aria-valuenow={g.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    data-testid={`goal-progress-${g.id}`}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Progress: {g.progress}%
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex gap-2 mt-4"
          role="navigation"
          aria-label="Goals pagination"
        >
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-2 py-1 border rounded"
            aria-label="Previous page"
            data-testid="goals-prev-page"
          >
            Prev
          </button>
          <span data-testid="goals-page">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-2 py-1 border rounded"
            aria-label="Next page"
            data-testid="goals-next-page"
          >
            Next
          </button>
        </div>
      )}
      
      <GoalModal
        open={openGoal}
        onClose={() => {
          setOpenGoal(false);
          setEditingGoal(null);
        }}
        goal={editingGoal}
        onSubmit={handleSubmit}
        isSubmitting={createGoal.isLoading || updateGoal.isLoading}
      />
    </div>
  );
}
