import React, { useState, useEffect, useMemo } from "react";
import { navigateToDashboardAfterAllSaves } from "./onboardingNavigation";
import OnboardingLayout from "../../layouts/OnboardingLayout";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";
import LoadingSpinner from "../LoadingSpinner";
import formatINR from "../../utils/formatINR";

const INCOME_KEYS = ["salary", "business", "rent", "dividends", "other_income"];
const EXPENSE_KEYS = [
  "housing",
  "utilities",
  "groceries",
  "transport",
  "insurance",
  "education",
  "emis",
  "other_expense",
];

export default function IncomeExpenseStep({
  userId,
  data,
  onChange,
  onComplete,
}) {
  const [income, setIncome] = useState({});
  const [expenses, setExpenses] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // If parent provided a controlled `data` prop (tests do this), use it and skip loading
    if (data) {
      setLoading(false);
      setIncome(data.monthly_income_details || {});
      setExpenses(data.monthly_expenses_details || {});
      return;
    }
    if (!userId) return;
    (async () => {
      const res = await supabase
        .from("profiles")
        .select(
          "id, monthly_income, monthly_expenses, monthly_income_details, monthly_expenses_details"
        )
        .eq("id", userId)
        .maybeSingle();
      setLoading(false);
      const d = res?.data;
      setIncome((d && d.monthly_income_details) || {});
      setExpenses((d && d.monthly_expenses_details) || {});
    })();
  }, [userId, data]);

  // propagate changes to parent if onChange provided
  const propagate = (nextIncome, nextExpenses) => {
    if (typeof onChange === "function") {
      onChange({
        monthly_income_details: nextIncome,
        monthly_expenses_details: nextExpenses,
      });
    }
  };

  const totalIncome = useMemo(
    () => INCOME_KEYS.reduce((s, k) => s + Number(income[k] || 0), 0),
    [income]
  );
  const totalExpenses = useMemo(
    () => EXPENSE_KEYS.reduce((s, k) => s + Number(expenses[k] || 0), 0),
    [expenses]
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      // Defensive: always send all required fields, coerce types, guard for nulls
      const payload = {
        id: userId,
        monthly_income: Number(totalIncome) || 0,
        monthly_expenses: Number(totalExpenses) || 0,
        monthly_income_details: income || {},
        monthly_expenses_details: expenses || {},
      };
      // Diagnostic log
      // eslint-disable-next-line no-console
      console.log("[IncomeExpenseStep][save]", { payload });
      const { error } = await supabase.from("profiles").upsert(payload);
      if (error) {
        // eslint-disable-next-line no-console
        console.error("[IncomeExpenseStep][save] error", error, payload);
        notifyError("Could not save Income & Expenses");
        return;
      }
      // Invalidate all relevant queries for charts
      if (window.queryClient) {
        window.queryClient.invalidateQueries(["cashflow-profile", userId]);
        window.queryClient.invalidateQueries(["networth", userId]);
        window.queryClient.invalidateQueries(["allocation", userId]);
      }
      notifySuccess("Income & Expenses saved");
      if (typeof onComplete === "function") onComplete();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[IncomeExpenseStep][save] unexpected", e);
      notifyError("Could not save Income & Expenses");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <OnboardingLayout title="Income & Expenses">
        <LoadingSpinner text="Loading..." />
      </OnboardingLayout>
    );

  return (
    <OnboardingLayout title="Income & Expenses">
      <div className="space-y-5" data-testid="onboarding-step-income-expense">
        <div>
          <h3 className="font-semibold mb-2">Monthly Income</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {INCOME_KEYS.map((k) => (
              <div key={k}>
                <label className="block mb-1 capitalize">
                  {k.replace(/_/g, " ")}
                </label>
                <input
                  type="number"
                  min="0"
                  value={income[k] || ""}
                  onChange={(e) => {
                    const next = { ...(income || {}), [k]: e.target.value };
                    setIncome(next);
                    propagate(next, expenses);
                  }}
                  className="border border-gray-300 rounded-lg p-2.5 w-full"
                  data-testid={`income-${k}`}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 font-medium">
            Total Income: {formatINR(totalIncome)}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Monthly Expenses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EXPENSE_KEYS.map((k) => (
              <div key={k}>
                <label className="block mb-1 capitalize">
                  {k.replace(/_/g, " ")}
                </label>
                <input
                  type="number"
                  min="0"
                  value={expenses[k] || ""}
                  onChange={(e) => {
                    const next = { ...(expenses || {}), [k]: e.target.value };
                    setExpenses(next);
                    propagate(income, next);
                  }}
                  className="border border-gray-300 rounded-lg p-2.5 w-full"
                  data-testid={`expense-${k}`}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 font-medium">
            Total Expenses: {formatINR(totalExpenses)}
          </div>
        </div>

        <div>
          <button
            disabled={saving}
            onClick={handleSave}
            data-testid="submit-button"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2.5"
          >
            {saving ? "Saving..." : "Save Income & Expenses"}
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
