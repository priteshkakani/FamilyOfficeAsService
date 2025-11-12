import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import formatINR from "../../utils/formatINR";

export default function UpcomingGoals({ userId }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGoals() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("goals")
          .select("id,title,target_amount,target_date,priority,is_completed")
          .eq("user_id", userId)
          .order("target_date", { ascending: true });
        if (error) throw error;
        setGoals(data || []);
      } catch (err) {
        console.error("[UpcomingGoals][fetch]", err);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchGoals();
  }, [userId]);

  if (loading) return <div>Loading goals...</div>;

  // Diagnostics
  console.log(
    "[GoalsRender] Array?",
    Array.isArray(goals),
    "Length:",
    goals.length
  );
  if (goals.length > 0) {
    console.log("[GoalsRender] Sample keys:", Object.keys(goals[0]));
  }

  return (
    <div data-testid="goals-list">
      <h3 className="text-lg font-semibold mb-2">Upcoming Goals</h3>
      {goals.length === 0 ? (
        <div className="text-gray-500">No goals found.</div>
      ) : (
        <ul className="space-y-2">
          {goals.map((g) => {
            let date = g.target_date;
            if (!date && g.target_year) date = `${g.target_year}-12-31`;
            return (
              <li
                key={g.id}
                className="bg-white rounded shadow p-3 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{g.title}</div>
                  <div className="text-sm text-gray-600">
                    {formatINR(g.target_amount)} &bull; {date}
                  </div>
                  <div className="text-xs text-gray-400">
                    Priority: {g.priority}
                  </div>
                </div>
                {g.is_completed && (
                  <span className="text-green-600 font-bold">Done</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
