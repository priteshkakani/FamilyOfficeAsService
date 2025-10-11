import StepWizard from "react-step-wizard";
import {
  LucideUser,
  LucideUsers,
  LucideDatabase,
  LucideTrendingUp,
  LucideTarget,
  LucideCheckCircle,
} from "lucide-react";
import Step1Signup from "./Step1Signup";
import Step2Family from "./Step2Family";
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
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between mb-8">
        {steps.map((step, idx) => (
          <div
            key={step.label}
            className="flex flex-col items-center text-gray-500"
          >
            <step.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{step.label}</span>
          </div>
        ))}
      </div>
      <StepWizard>
        <Step1Signup />
        <Step2Family />
        {/* <Step3DataSources />
        <Step4IncomeExpense />
        <Step5Goals />
        <Step6Summary /> */}
      </StepWizard>
    </div>
  );
}
