import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { navigateToDashboardAfterAllSaves } from "../components/Onboarding/onboardingNavigation";

export default function Onboarding({ onFinish }) {
  const [step, setStep] = useState(() => {
    const persisted = localStorage.getItem("onboardingStep");
    return persisted ? Number(persisted) : 0;
  });
  const [completed, setCompleted] = useState([]);
  const navigate = useNavigate();
  const userId = supabase.auth.user()?.id;

  const steps = [
    { key: "profile", label: "Profile & Emails" },
    { key: "family", label: "Family Members" },
    { key: "income", label: "Income & Employment" },
    { key: "liabilities", label: "Loans / Liabilities" },
    { key: "documents", label: "Documents Upload" },
    { key: "other", label: "Other Info & Terms" },
  ];

  function goToStep(idx) {
    setStep(idx);
    localStorage.setItem("onboardingStep", idx);
  }

  function markComplete(idx) {
    setCompleted((prev) => [...new Set([...prev, idx])]);
  }

  function handleNext() {
    markComplete(step);
    if (step < steps.length - 1) {
      goToStep(step + 1);
    }
  }

  // Called after the final onboarding save and query invalidation
  function handleOnboardingComplete() {
    navigateToDashboardAfterAllSaves(navigate);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 space-y-5">
        {/* Stepper */}
        <div className="mb-6">
          {/* import OnboardingStepper dynamically to avoid circular deps */}
          {React.createElement(
            require("../components/Onboarding/OnboardingStepper.jsx").default,
            {
              steps,
              currentStep: step,
              completedSteps: completed,
              onStepClick: goToStep,
            }
          )}
        </div>
        {/* Step content */}
        {step === 0 &&
          React.createElement(
            require("../components/Onboarding/ProfileStep.jsx").default,
            {
              onNext: handleNext,
              currentStep: step,
              userId,
            }
          )}
        {step === 1 &&
          React.createElement(
            require("../components/Onboarding/FamilyStep.jsx").default,
            {
              userId,
              onChange: () => {},
              data: {},
            }
          )}
        {step === 2 &&
          React.createElement(
            require("../components/Onboarding/IncomeRecordsStep.jsx").default,
            {
              userId,
              onComplete:
                step === steps.length - 1
                  ? handleOnboardingComplete
                  : undefined,
            }
          )}
        {step === 3 &&
          React.createElement(
            require("../components/Onboarding/LiabilitiesStep.jsx").default,
            {
              userId,
              onComplete:
                step === steps.length - 1
                  ? handleOnboardingComplete
                  : undefined,
            }
          )}
        {step === 4 &&
          React.createElement(
            require("../components/Onboarding/DocumentsUploadStep.jsx").default,
            {
              userId,
              onComplete:
                step === steps.length - 1
                  ? handleOnboardingComplete
                  : undefined,
            }
          )}
        {step === 5 &&
          React.createElement(
            require("../components/Onboarding/OtherInfoTermsStep.jsx").default,
            {
              userId,
              onComplete: handleOnboardingComplete,
            }
          )}
        {/* Navigation */}
        <div className="pt-4 flex justify-between">
          <button
            type="button"
            className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2"
            disabled={step === 0}
            onClick={() => goToStep(step - 1)}
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2.5"
              onClick={handleNext}
            >
              Next
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
