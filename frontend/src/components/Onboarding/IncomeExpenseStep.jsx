import React, { useState, useEffect } from "react";
import { computeMonthlyTotals } from "../../utils/helpers";
import LoadingSpinner from "../LoadingSpinner";

const INCOME_CATEGORIES = [
  { key: "salary", label: "Primary Salary" },
  { key: "business", label: "Business" },
  { key: "rent", label: "Rent" },
  { key: "dividends", label: "Dividends" },
  { key: "other_income", label: "Other" },
];
const EXPENSE_CATEGORIES = [
  { key: "housing", label: "Housing" },
  { key: "utilities", label: "Utilities" },
  { key: "groceries", label: "Groceries" },
  { key: "transport", label: "Transport" },
  { key: "insurance", label: "Insurance Premiums" },
  { key: "education", label: "Education" },
  { key: "emis", label: "EMIs" },
  { key: "other_expense", label: "Other" },
];

export default function IncomeExpenseStep({ data, onChange }) {
  const [income, setIncome] = useState(data.income || {});
  const [expenses, setExpenses] = useState(data.expenses || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update parent with totals and granular data
    onChange({
      ...data,
      income,
      expenses,
      monthly_income: computeMonthlyTotals(income),
      monthly_expenses: computeMonthlyTotals(expenses),
    });
    // eslint-disable-next-line
  }, [income, expenses]);

  const handleIncome = (e) => {
    setIncome((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleExpense = (e) => {
    setExpenses((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const totalIncome = computeMonthlyTotals(income);
  const totalExpenses = computeMonthlyTotals(expenses);

  return (
    <div data-testid="onboarding-step-income-expense">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Monthly Income & Expenses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Income Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Monthly Income
          </h3>
          <div className="space-y-3">
            {INCOME_CATEGORIES.map((cat) => (
              <div key={cat.key} className="flex items-center gap-2">
                <label
                  htmlFor={`income-${cat.key}`}
                  className="w-40 text-gray-600"
                >
                  {cat.label}
                </label>
                <input
                  id={`income-${cat.key}`}
                  name={cat.key}
                  type="number"
                  min="0"
                  value={income[cat.key] || ""}
                  onChange={handleIncome}
                  className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  placeholder="0"
                  data-testid={`income-${cat.key}`}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 text-blue-700 font-semibold">
            Total Income: ₹{totalIncome.toLocaleString("en-IN")}
          </div>
        </div>
        {/* Expenses Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Monthly Expenses
          </h3>
          <div className="space-y-3">
            {EXPENSE_CATEGORIES.map((cat) => (
              <div key={cat.key} className="flex items-center gap-2">
                <label
                  htmlFor={`expense-${cat.key}`}
                  className="w-40 text-gray-600"
                >
                  {cat.label}
                </label>
                <input
                  id={`expense-${cat.key}`}
                  name={cat.key}
                  type="number"
                  min="0"
                  value={expenses[cat.key] || ""}
                  onChange={handleExpense}
                  className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  placeholder="0"
                  data-testid={`expense-${cat.key}`}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 text-blue-700 font-semibold">
            Total Expenses: ₹{totalExpenses.toLocaleString("en-IN")}
          </div>
        </div>
      </div>
    </div>
  );
}
