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
import Step1Signup from "./Step1Signup.jsx";
import Step2Family from "./Step2Family.jsx";
import { useNavigate } from "react-router-dom";
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

  const handleComplete = async () => {
    const session =
      supabase.auth.getSession &&
      (await supabase.auth.getSession()).data.session;
    if (session?.user?.id) {
      await supabase
        .from("profiles")
        .update({ is_onboarded: true })
        .eq("id", session.user.id);
    }
    navigate && navigate("/dashboard");
  };

  const handleNext = (userId) =>
    setCurrent((c) => Math.min(c + 1, steps.length - 1));
  const handleBack = () => setCurrent((c) => Math.max(c - 1, 0));

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{steps[current].label}</h2>
      <div className="flex justify-between mb-8">
        {steps.map((step, idx) => (
          <div
            key={step.label}
            className={`flex flex-col items-center ${
              idx === current ? "text-blue-600" : "text-gray-500"
            }`}
            data-testid={`onboarding-wizard-pill-${idx}`}
          >
            <step.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{step.label}</span>
          </div>
        ))}
      </div>

      <div>
        {current === 0 && <Step1Signup onNext={handleNext} />}
        {current === 1 && (
          <Step2Family onNext={handleNext} onBack={handleBack} />
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
  );
}
