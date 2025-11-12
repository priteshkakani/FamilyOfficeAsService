import React from "react";

const StepItem = ({ idx, label, status, onClick, visited, testId }) => {
  const base = "flex items-center gap-3 p-3 rounded-lg cursor-pointer";
  const styles =
    status === "active"
      ? "bg-blue-600 text-white"
      : status === "done"
      ? "bg-green-50 text-green-600"
      : "text-gray-500 hover:bg-gray-100";

  return (
    <div
      role="button"
      aria-disabled={!visited}
      onClick={() => visited && onClick(idx)}
      className={`${base} ${styles}`}
      // primary test id used by unit tests is the pill keyed by step key
      data-testid={testId || `onboarding-step-${idx}`}
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
  // Default steps when none are provided (tests expect these keys/labels)
  const defaultSteps = [
    { key: "profile", label: "Profile" },
    { key: "family", label: "Family" },
    { key: "sources", label: "Data Sources" },
    { key: "income_expense", label: "Income & Expenses" },
    { key: "liabilities", label: "Liabilities" },
    { key: "goals", label: "Goals" },
  ];

  const safeSteps = Array.isArray(steps) && steps.length ? steps : defaultSteps;
  const safeCompleted = Array.isArray(completedSteps) ? completedSteps : [];
  const safeOnClick =
    typeof onStepClick === "function" ? onStepClick : () => {};

  // Normalize steps to objects with {key,label}
  const normalized = safeSteps.map((s, idx) =>
    typeof s === "string"
      ? { key: s.toLowerCase().replace(/\s+/g, "_"), label: s }
      : s
  );

  return (
    <nav aria-label="Onboarding steps" className="space-y-3">
      {normalized.map((s, idx) => {
        const done = safeCompleted.includes(idx) || false;
        const activeIndex = currentStep ?? 0;
        const status =
          idx === activeIndex ? "active" : done ? "done" : "pending";
        const visited = idx <= activeIndex || done;
        return (
          <div key={s.key}>
            <StepItem
              idx={idx}
              label={s.label}
              status={status}
              onClick={() => safeOnClick(idx)}
              visited={visited}
              testId={`onboarding-step-pill-${s.key}`}
            />
            {/* legacy hidden pill test id removed: visible pill element now exposes the key-based test id */}
            {idx === (currentStep ?? 0) ? (
              <span
                data-testid={`onboarding-current-step-${s.key}`}
                style={{ display: "none" }}
              />
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
