import React from "react";

const StepItem = ({ idx, label, status, onClick, visited }) => {
  const base = "flex items-center gap-3 p-3 rounded-lg cursor-pointer";
  const styles =
    status === "active"
      ? "bg-blue-50 text-blue-600"
      : status === "done"
      ? "bg-green-50 text-green-600"
      : "text-gray-500 hover:bg-gray-100";

  return (
    <div
      role="button"
      aria-disabled={!visited}
      onClick={() => visited && onClick(idx)}
      className={`${base} ${styles}`}
      data-testid={`onboarding-step-${idx}`}
    >
      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-white border">
        {idx + 1}
      </div>
      <div className="text-sm font-medium">{label}</div>
    </div>
  );
};

export default function OnboardingStepper({
  steps,
  currentStep,
  onStepClick,
  completedSteps,
}) {
  // Defensive defaults
  const safeSteps = Array.isArray(steps) ? steps : [];
  const safeCompleted = Array.isArray(completedSteps) ? completedSteps : [];
  const safeOnClick =
    typeof onStepClick === "function" ? onStepClick : () => {};

  return (
    <nav aria-label="Onboarding steps" className="space-y-3">
      {safeSteps.map((s, idx) => {
        const done = safeCompleted.includes(idx) || false;
        const status =
          idx === currentStep ? "active" : done ? "done" : "pending";
        const visited = idx <= currentStep || done;
        return (
          <StepItem
            key={typeof s === "string" ? s : `${idx}`}
            idx={idx}
            label={s}
            status={status}
            onClick={safeOnClick}
            visited={visited}
          />
        );
      })}
    </nav>
  );
}
