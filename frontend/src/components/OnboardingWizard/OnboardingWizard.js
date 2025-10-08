import React, { useState } from "react";
import Step1Signup from "./Step1Signup";
import Step2Family from "./Step2Family";
import Step3Assets from "./Step3Assets";

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [householdId, setHouseholdId] = useState(null);

  return (
    <div>
      {step === 1 && (
        <Step1Signup
          onNext={(id) => {
            setUserId(id);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <Step2Family
          userId={userId}
          onNext={(id) => {
            setHouseholdId(id);
            setStep(3);
          }}
        />
      )}
      {step === 3 && (
        <Step3Assets householdId={householdId} onNext={() => setStep(4)} />
      )}
      {step === 4 && <div>Onboarding Complete!</div>}
    </div>
  );
}
