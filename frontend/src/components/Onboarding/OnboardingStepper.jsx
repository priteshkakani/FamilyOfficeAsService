import React, { useState } from "react";
import ProfileStep from "./ProfileStep";
import FamilyStep from "./FamilyStep";
import DataSourcesStep from "./DataSourcesStep";
import IncomeExpenseStep from "./IncomeExpenseStep";
import LiabilitiesSummaryStep from "./LiabilitiesSummaryStep";
import GoalsStep from "./GoalsStep";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";
import LoadingSpinner from "../LoadingSpinner";
import { useNavigate } from "react-router-dom";

const STEPS = [
  { key: "profile", label: "Profile", Component: ProfileStep },
  { key: "family", label: "Family", Component: FamilyStep },
  { key: "sources", label: "Data Sources", Component: DataSourcesStep },
  {
    key: "income_expense",
    label: "Income & Expenses",
    Component: IncomeExpenseStep,
  },
  {
    key: "liabilities",
    label: "Liabilities",
    Component: LiabilitiesSummaryStep,
  },
  { key: "goals", label: "Goals", Component: GoalsStep },
];

export default function OnboardingStepper() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const CurrentStep = STEPS[step].Component;

  const handleNext = async () => {
    setSaving(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) throw new Error("No user session");
      // Save step data to Supabase (profiles or related tables)
      if (STEPS[step].key === "profile") {
        const { full_name, email, mobile_number } = form;
        const { error } = await supabase
          .from("profiles")
          .update({ full_name, email, mobile_number, onboarding_step: 2 })
          .eq("id", user.id);
        if (error) throw error;
      }
      // Add more per-step saves as needed
      if (step < STEPS.length - 1) {
        setStep((s) => s + 1);
      } else {
        // Final step: set is_onboarded = true
        const { error } = await supabase
          .from("profiles")
          .update({ is_onboarded: true })
          .eq("id", user.id);
        if (error) throw error;
        notifySuccess("Onboarding complete!");
        navigate("/dashboard");
      }
    } catch (e) {
      notifyError(`[Onboarding][${STEPS[step].key}] ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  return (
    <div data-testid="onboarding-stepper-root">
      <div
        className="flex justify-center mb-6"
        data-testid="onboarding-stepper-pills"
      >
        {STEPS.map((s, i) => (
          <div
            key={s.key}
            data-testid={`onboarding-step-pill-${s.key}`}
            aria-current={i === step ? "step" : undefined}
            className={`px-4 py-2 rounded-full mx-1 text-sm font-medium ${
              i === step
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {s.label}
          </div>
        ))}
      </div>
      <div data-testid={`onboarding-current-step-${STEPS[step].key}`}>
        <CurrentStep data={form} onChange={setForm} />
      </div>
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={step === 0 || saving}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-5 py-2.5"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2.5"
          data-testid="submit-button"
        >
          {saving ? "Saving..." : step === STEPS.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
      {saving && <LoadingSpinner text="Saving..." />}
    </div>
  );
}
