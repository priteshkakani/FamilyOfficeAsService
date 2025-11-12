import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";

export default function GoalsPanel() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    target_amount: "",
    target_date: "",
    priority: "Medium",
    is_completed: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: rows } = await supabase
          .from("goals")
          .select("*")
          .order("target_date", { ascending: true });
        setGoals(rows || []);
      } catch (err) {
        notifyError("Failed to load goals");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({ ...row });
  };

  const handleSave = async () => {
    if (!form.title || !form.target_amount || !form.target_date)
      return notifyError("Title, amount, and date required");
    try {
      const payload = {
        ...form,
        target_amount: Number(form.target_amount),
        is_completed: !!form.is_completed,
      };
      if (editingId) {
        const { error } = await supabase
          .from("goals")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        notifySuccess("Goal updated");
      } else {
        const { error } = await supabase.from("goals").insert(payload);
        if (error) throw error;
        notifySuccess("Goal added");
      }
      setEditingId(null);
      setForm({
        title: "",
        description: "",
        target_amount: "",
        target_date: "",
        priority: "Medium",
        is_completed: false,
      });
      // Reload
      const { data: rows } = await supabase
        .from("goals")
        .select("*")
        .order("target_date", { ascending: true });
      setGoals(rows || []);
    } catch (err) {
      notifyError("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    try {
      const { error } = await supabase.from("goals").delete().eq("id", id);
      if (error) throw error;
      notifySuccess("Goal deleted");
      setGoals(goals.filter((g) => g.id !== id));
    } catch (err) {
      notifyError("Delete failed");
    }
  };

  const completed = goals.filter((g) => g.is_completed).length;
  const total = goals.length;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="w-full md:w-2/3">
          <h3 className="font-semibold mb-2">Upcoming Goals</h3>
          <div className="bg-white rounded shadow p-4" data-testid="goals-list">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th>Title</th>
                    <th>Description</th>
                    <th>Target Amount</th>
                    <th>Target Date</th>
                    <th>Priority</th>
                    <th>Completed</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {goals.map((row) => (
                    <tr key={row.id} className="border-b">
                      {/* ...existing code... */}
                    </tr>
                  ))}
                  {/* ...existing code... */}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
          <div className="text-lg font-bold">Progress</div>
          {loading ? (
            <div className="w-full bg-gray-100 rounded h-4 mt-2 animate-pulse" />
          ) : (
            <>
              <div className="w-full bg-gray-200 rounded h-4 mt-2">
                <div
                  className="bg-blue-600 h-4 rounded"
                  style={{ width: `${progress}%` }}
                  data-testid="goals-progress-bar"
                ></div>
              </div>
              <div className="text-md font-medium mt-2">
                {completed} / {total} completed
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
