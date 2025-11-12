import React from "react";
import { Navigate } from "react-router-dom";
import OnboardingStepper from "../components/Onboarding/OnboardingStepper";

export default function OnboardingRoute({ isOnboarded = false }) {
  if (isOnboarded) return <Navigate to="/dashboard" replace />;
  return (
    <div>
      <h1>Onboarding</h1>
      <OnboardingStepper />
    </div>
  );
}
