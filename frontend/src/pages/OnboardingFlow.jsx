import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { useOnboardingState } from "../hooks/useOnboardingState";
import ProfileStep from "../components/Onboarding/ProfileStep";
import FamilyStep from "../components/Onboarding/FamilyStep";
import DataSourcesStep from "../components/Onboarding/DataSourcesStep";
import IncomeExpenseStep from "../components/Onboarding/IncomeExpenseStep";
import GoalsStep from "../components/Onboarding/GoalsStep";
import SummaryStep from "../components/Onboarding/SummaryStep";

const steps = [
  {
    key: "profile",
    label: "Profile",
    component: ProfileStep,
    testid: "onboarding-step-profile",
  },
  {
    key: "family",
    label: "Family",
    component: FamilyStep,
    testid: "onboarding-step-family",
  },
  {
    key: "dataSources",
    label: "Data Sources",
    component: DataSourcesStep,
    testid: "onboarding-step-data-sources",
  },
  {
    key: "incomeExpense",
    label: "Income & Expenses",
    component: IncomeExpenseStep,
    testid: "onboarding-step-income-expense",
  },
  {
    key: "goals",
    label: "Goals",
    component: GoalsStep,
    testid: "onboarding-step-goals",
  },
  {
    key: "summary",
    label: "Summary",
    component: SummaryStep,
    testid: "onboarding-summary",
  },
];

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const {
    state,
    stepIndex,
    loading,
    error,
    handleNext,
    handleBack,
    handleChange,
    handleFinish,
    setStepIndex,
    fetchProfile,
    fetchFamily,
    fetchGoals,
  } = useOnboardingState();

  // Per-step fetch on mount or step change
  useEffect(() => {
    if (stepIndex === 0) fetchProfile();
    else if (stepIndex === 1) fetchFamily();
    else if (stepIndex === 4) fetchGoals();
    // Add fetchDataSources, fetchIncomeExpenses as needed
    // eslint-disable-next-line
  }, [stepIndex]);

  useEffect(() => {
    if (state.is_onboarded) {
      navigate("/dashboard");
    }
    // eslint-disable-next-line
  }, [state.is_onboarded]);

  const StepComponent = steps[stepIndex].component;
  // Validation for Profile step
  const isProfileStep = stepIndex === 0;
  const isProfileValid =
    typeof state.full_name === "string" &&
    state.full_name.trim() !== "" &&
    typeof state.email === "string" &&
    state.email.trim() !== "" &&
    typeof state.mobile_number === "string" &&
    state.mobile_number.trim() !== "";
  const [showValidation, setShowValidation] = React.useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-xl">
        <LinearProgress
          variant="determinate"
          value={((stepIndex + 1) / steps.length) * 100}
          sx={{ mb: 3, height: 8, borderRadius: 2 }}
        />
        <Card>
          <CardContent>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
              {steps[stepIndex].label}
            </h2>
            <div style={{ marginBottom: 16, color: "#6b7280" }}>
              Step {stepIndex + 1} of {steps.length}
            </div>
            {loading ? (
              <div
                data-testid="loading"
                style={{ textAlign: "center", padding: 32 }}
              >
                Loading...
              </div>
            ) : (
              <div data-testid={steps[stepIndex].testid}>
                <StepComponent
                  data={state}
                  onChange={handleChange}
                  error={error}
                  showValidation={isProfileStep ? showValidation : false}
                />
              </div>
            )}
            {error && (
              <div style={{ color: "#ef4444", marginTop: 8 }}>{error}</div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 32,
              }}
            >
              <Button
                data-testid="back-button"
                onClick={handleBack}
                disabled={stepIndex === 0 || loading}
                variant="outlined"
              >
                Back
              </Button>
              {stepIndex < steps.length - 1 ? (
                <Button
                  data-testid="next-button"
                  onClick={async () => {
                    if (isProfileStep && !isProfileValid) {
                      setShowValidation(true);
                      return;
                    }
                    setShowValidation(false);
                    await handleNext();
                  }}
                  disabled={loading}
                  variant="contained"
                  color="primary"
                >
                  Next
                </Button>
              ) : (
                <Button
                  data-testid="finish-onboarding"
                  onClick={handleFinish}
                  disabled={loading}
                  variant="contained"
                  color="success"
                >
                  Finish Onboarding
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
