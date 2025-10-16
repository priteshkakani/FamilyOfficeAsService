import { render, screen } from "@testing-library/react";
import OnboardingStepper from "../components/Onboarding/OnboardingStepper";
import "@testing-library/jest-dom";

describe("OnboardingStepper", () => {
  it("renders all steps", () => {
    const steps = [
      "Profile",
      "Family",
      "Data Sources",
      "Income/Expense",
      "Liabilities",
      "Goals",
    ];
    render(<OnboardingStepper steps={steps} currentStep={2} />);
    steps.forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  it("highlights the current step", () => {
    const steps = [
      "Profile",
      "Family",
      "Data Sources",
      "Income/Expense",
      "Liabilities",
      "Goals",
    ];
    render(<OnboardingStepper steps={steps} currentStep={3} />);
    const current = screen.getByText("Income/Expense");
    expect(current).toHaveClass("active");
  });
});
