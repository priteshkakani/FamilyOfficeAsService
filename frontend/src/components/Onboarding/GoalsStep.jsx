import React from "react";

export default function GoalsStep({ data, onChange }) {
  const goals = data.goals || [];
  const handleChange = (idx, value) => {
    const updated = goals.map((g, i) => (i === idx ? value : g));
    onChange({ ...data, goals: updated });
  };
  const addGoal = () => {
    onChange({ ...data, goals: [...goals, ""] });
  };
  const removeGoal = (idx) => {
    onChange({ ...data, goals: goals.filter((_, i) => i !== idx) });
  };
  return (
    <div>
      <div className="mb-2 font-medium">List your top 2–3 financial goals:</div>
      {goals.map((goal, idx) => (
        <div key={idx} className="flex gap-2 mb-2 items-center">
          <input
            type="text"
            value={goal}
            onChange={(e) => handleChange(idx, e.target.value)}
            className="input input-bordered flex-1"
            placeholder={`Goal ${idx + 1}`}
          />
          <button
            type="button"
            onClick={() => removeGoal(idx)}
            className="btn btn-error btn-sm"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addGoal}
        className="btn btn-primary btn-sm mt-2"
      >
        Add Goal
      </button>
    </div>
  );
}
