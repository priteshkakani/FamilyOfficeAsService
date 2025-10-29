import React from "react";
// Simplified wizard: use local step state instead of react-step-wizard so tests
// can deterministically advance steps without relying on an external library.
import {
  LucideUser,
  LucideUsers,
  LucideDatabase,
  LucideTrendingUp,
  LucideTarget,
  LucideCheckCircle,
} from "lucide-react";
import Step2Family from "./Step2Family.jsx";
import ProfileStep from "../Onboarding/ProfileStep";
import OnboardingLayout from "../Onboarding/OnboardingLayout";
import OnboardingStepper from "../Onboarding/OnboardingStepper";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
// TODO: Implement these steps with React Hook Form + Zod
// import Step3DataSources from "./Step3DataSources";
// import Step4IncomeExpense from "./Step4IncomeExpense";
// import Step5Goals from "./Step5Goals";
// import Step6Summary from "./Step6Summary";

const steps = [
  { label: "Profile", icon: LucideUser },
  { label: "Family", icon: LucideUsers },
  { label: "Data Sources", icon: LucideDatabase },
  { label: "Income/Expense", icon: LucideTrendingUp },
  { label: "Goals", icon: LucideTarget },
  { label: "Summary", icon: LucideCheckCircle },
];

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const [current, setCurrent] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState([]);

  const handleComplete = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user ?? null;
      if (user?.id) {
        await supabase
          .from("profiles")
          .update({ is_onboarded: true })
          .eq("id", user.id);
      }
    } catch (err) {
      console.error("[OnboardingWizard][complete]", err);
    }
    navigate && navigate("/dashboard");
  };

  const handleNext = (userId) =>
    setCurrent((c) => Math.min(c + 1, steps.length - 1));
  const handleBack = () => setCurrent((c) => Math.max(c - 1, 0));

  return (
    <OnboardingLayout
      stepper={
        <OnboardingStepper
          steps={steps.map((s) => s.label)}
          currentStep={current}
          completedSteps={completedSteps}
          onStepClick={(i) => {
            // allow navigation only to visited steps
            if (i <= current || completedSteps.includes(i)) setCurrent(i);
          }}
        />
      }
    >
      <div>
        <h2 className="text-2xl font-bold mb-4">{steps[current].label}</h2>
        <div>
          {current === 0 && (
            <ProfileStep
              currentStep={0}
              setCompleted={setCompletedSteps}
              onNext={() => {
                setCompletedSteps((c) =>
                  Array.from(new Set([...(c || []), 0]))
                );
                handleNext();
              }}
            />
          )}
          {current === 1 && (
            <Step2Family
              onNext={() => {
                setCompletedSteps((c) =>
                  Array.from(new Set([...(c || []), 1]))
                );
                handleNext();
              }}
              onBack={handleBack}
            />
          )}

          {/* Future steps will be conditionally rendered here */}
          {current === steps.length - 1 && (
            <div>
              <button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded"
                data-testid="finish-onboarding"
                onClick={handleComplete}
              >
                Complete Onboarding
              </button>
            </div>
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
}
