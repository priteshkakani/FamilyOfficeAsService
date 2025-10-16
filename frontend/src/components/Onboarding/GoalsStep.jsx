import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import LoadingSpinner from "../LoadingSpinner";
import { notifyError, notifySuccess } from "../../utils/toast";

const GOAL_TEMPLATES = [
  { label: "Retirement", priority: "High" },
  { label: "Child Education", priority: "High" },
  { label: "Child Marriage", priority: "Medium" },
  { label: "House Purchase", priority: "High" },
  { label: "Car Purchase", priority: "Medium" },
  { label: "Emergency Fund", priority: "High" },
  { label: "Vacation", priority: "Low" },
  { label: "Wealth Creation", priority: "Medium" },
];
const PRIORITIES = ["High", "Medium", "Low"];

export default function GoalsStep({ data, onChange }) {
  const [goals, setGoals] = useState(data.goals || []);
  const [loading, setLoading] = useState(false);
  const [upcoming, setUpcoming] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    onChange({ ...data, goals });
    // eslint-disable-next-line
  }, [goals]);

  useEffect(() => {
    let mounted = true;
    async function fetchUpcoming() {
      setLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
        if (!user) throw new Error("No user session");
        setUserId(user.id);
        const today = new Date().toISOString().slice(0, 10);
        const { data: up } = await supabase
          .from("goals")
          .select("title,target_amount,target_date,priority")
          .eq("user_id", user.id)
          .gt("target_date", today)
          .eq("is_completed", false)
          .order("target_date", { ascending: true });
        if (mounted) setUpcoming(up || []);
      } catch {
        if (mounted) setUpcoming([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUpcoming();
    return () => {
      mounted = false;
    };
  }, []);

  const addGoal = () => {
    setGoals((prev) => [
      ...prev,
      {
        template: GOAL_TEMPLATES[0].label,
        title: GOAL_TEMPLATES[0].label,
        target_amount: "",
        target_date: "",
        priority: GOAL_TEMPLATES[0].priority,
        notes: "",
      },
    ]);
  };
  const removeGoal = (idx) => {
    setGoals((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleGoalChange = (idx, field, value) => {
    setGoals((prev) =>
      prev.map((g, i) =>
        i === idx
          ? field === "template"
            ? {
                ...g,
                template: value,
                title: value,
                priority:
                  GOAL_TEMPLATES.find((t) => t.label === value)?.priority ||
                  "Medium",
              }
            : { ...g, [field]: value }
          : g
      )
    );
  };

  const handleSaveGoal = async (idx) => {
    const g = goals[idx];
    if (!g.title || !g.target_amount || !g.target_date) {
      notifyError("Title, target amount, and date are required");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("goals").insert({
        user_id: userId,
        title: g.title,
        target_amount: Number(g.target_amount),
        target_date: g.target_date,
        priority: g.priority,
        notes: g.notes,
      });
      if (error) throw error;
      notifySuccess("Goal saved");
      setGoals((prev) => prev.filter((_, i) => i !== idx));
      // Refresh upcoming
      const today = new Date().toISOString().slice(0, 10);
      const { data: up } = await supabase
        .from("goals")
        .select("title,target_amount,target_date,priority")
        .eq("user_id", userId)
        .gt("target_date", today)
        .eq("is_completed", false)
        .order("target_date", { ascending: true });
      setUpcoming(up || []);
    } catch (e) {
      notifyError(`[GoalsStep][save] ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="onboarding-step-goals">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Financial Goals
      </h2>
      <div className="space-y-6 mb-8">
        {goals.map((g, idx) => (
          <div
            key={idx}
            className="bg-gray-50 rounded-lg p-4 border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Goal Template
                </label>
                <select
                  value={g.template}
                  onChange={(e) =>
                    handleGoalChange(idx, "template", e.target.value)
                  }
                  className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  data-testid={`goal-template-${idx}`}
                >
                  {GOAL_TEMPLATES.map((t) => (
                    <option key={t.label} value={t.label}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Priority
                </label>
                <select
                  value={g.priority}
                  onChange={(e) =>
                    handleGoalChange(idx, "priority", e.target.value)
                  }
                  className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  data-testid={`goal-priority-${idx}`}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Title
                </label>
                <input
                  type="text"
                  value={g.title}
                  onChange={(e) =>
                    handleGoalChange(idx, "title", e.target.value)
                  }
                  className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  data-testid={`goal-title-${idx}`}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={g.target_amount}
                  onChange={(e) =>
                    handleGoalChange(idx, "target_amount", e.target.value)
                  }
                  className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  data-testid={`goal-amount-${idx}`}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Target Date
                </label>
                <input
                  type="date"
                  value={g.target_date}
                  onChange={(e) =>
                    handleGoalChange(idx, "target_date", e.target.value)
                  }
                  className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  data-testid={`goal-date-${idx}`}
                  required
                />
              </div>
            </div>
            <div className="mb-2">
              <label className="block mb-1 text-gray-700 font-medium">
                Notes
              </label>
              <input
                type="text"
                value={g.notes}
                onChange={(e) => handleGoalChange(idx, "notes", e.target.value)}
                className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                data-testid={`goal-notes-${idx}`}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleSaveGoal(idx)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2.5"
                disabled={loading}
                data-testid={`goal-save-${idx}`}
              >
                {loading ? "Saving..." : "Save Goal"}
              </button>
              <button
                type="button"
                onClick={() => removeGoal(idx)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-5 py-2.5"
                disabled={loading}
                data-testid={`goal-remove-${idx}`}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addGoal}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2.5"
          disabled={loading}
          data-testid="goal-add"
        >
          Add Goal
        </button>
      </div>
      <div className="mb-4">
        <h3 className="text-md font-semibold text-gray-700 mb-2">
          Upcoming Goals
        </h3>
        {loading ? (
          <LoadingSpinner text="Loading upcoming goals..." />
        ) : upcoming.length === 0 ? (
          <div className="text-gray-400">No upcoming goals.</div>
        ) : (
          <ul className="space-y-1">
            {upcoming.map((g, i) => (
              <li key={i} className="text-gray-700 text-sm">
                {g.title} - ₹{g.target_amount} by {g.target_date}{" "}
                <span className="text-xs text-gray-500">({g.priority})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
