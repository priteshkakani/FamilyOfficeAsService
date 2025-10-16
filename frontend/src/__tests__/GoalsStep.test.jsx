import { render, screen, fireEvent } from "@testing-library/react";
import GoalsStep from "../components/Onboarding/GoalsStep";
import "@testing-library/jest-dom";

describe("GoalsStep", () => {
  it("renders goal fields", () => {
    render(<GoalsStep data={{ goals: [] }} onChange={() => {}} />);
    expect(screen.getByText(/Add Goal/i)).toBeInTheDocument();
  });

  it("adds a new goal", () => {
    const onChange = jest.fn();
    render(<GoalsStep data={{ goals: [] }} onChange={onChange} />);
    fireEvent.click(screen.getByText(/Add Goal/i));
    expect(onChange).toHaveBeenCalled();
  });

  it("validates required fields for goal", () => {
    render(
      <GoalsStep
        data={{ goals: [{ name: "", amount: "" }] }}
        onChange={() => {}}
        showValidation={true}
      />
    );
    expect(screen.getByText(/Goal name is required/i)).toBeInTheDocument();
  });
});
