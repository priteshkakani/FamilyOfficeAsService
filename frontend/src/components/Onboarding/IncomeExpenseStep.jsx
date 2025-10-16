import React from "react";

export default function IncomeExpenseStep({ data, onChange }) {
  const handleInput = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Monthly Income</label>
        <input
          type="number"
          name="monthly_income"
          value={data.monthly_income || ""}
          onChange={handleInput}
          className="input input-bordered w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Monthly Expenses</label>
        <input
          type="number"
          name="monthly_expenses"
          value={data.monthly_expenses || ""}
          onChange={handleInput}
          className="input input-bordered w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Liabilities Summary</label>
        <textarea
          name="liabilities_summary"
          value={data.liabilities_summary || ""}
          onChange={handleInput}
          className="textarea textarea-bordered w-full"
        />
      </div>
    </div>
  );
}
