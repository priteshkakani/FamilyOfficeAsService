import { render, screen } from "@testing-library/react";
import OnboardingStepper from "../components/Onboarding/OnboardingStepper";
import "@testing-library/jest-dom";

describe("OnboardingStepper", () => {
  it("renders all steps", () => {
    const steps = [
      { key: "profile", label: "Profile" },
      { key: "family", label: "Family" },
      { key: "sources", label: "Data Sources" },
      { key: "income_expense", label: "Income & Expenses" },
      { key: "liabilities", label: "Liabilities" },
      { key: "goals", label: "Goals" },
    ];
    render(<OnboardingStepper />);
    steps.forEach((step) => {
      const pill = screen.getByTestId(`onboarding-step-pill-${step.key}`);
      expect(pill).toBeInTheDocument();
      expect(pill).toHaveTextContent(step.label);
    });
  });

  it("highlights the current step", () => {
    const steps = [
      "Profile",
      "Family",
      "Data Sources",
      "Income & Expenses",
      "Liabilities",
      "Goals",
    ];
    render(<OnboardingStepper />);
    // OnboardingStepper uses internal state and starts at step 0 (Profile)
    const active = screen.getByTestId("onboarding-step-pill-profile");
    expect(active).toHaveClass("bg-blue-600");
    expect(active).toHaveClass("text-white");
  });
});
