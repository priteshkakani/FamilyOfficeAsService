import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GoalsStep from "../components/Onboarding/GoalsStep";
import "@testing-library/jest-dom";

describe("GoalsStep", () => {
  it("renders goal fields", () => {
    render(<GoalsStep data={{ goals: [] }} onChange={() => {}} />);
    // Add Goal button has testid
    expect(screen.getByTestId("goal-add")).toBeInTheDocument();
  });

  it("adds a new goal", async () => {
    const onChange = vi.fn();
    render(<GoalsStep data={{ goals: [] }} onChange={onChange} />);
    fireEvent.click(screen.getByTestId("goal-add"));
    await waitFor(() => expect(onChange).toHaveBeenCalled());
  });

  it("renders goal inputs when provided", () => {
    render(
      <GoalsStep
        data={{
          goals: [
            { title: "Test", target_amount: "1000", target_date: "2026-01-01" },
          ],
        }}
        onChange={() => {}}
      />
    );
    expect(screen.getByTestId("goal-title-0")).toBeInTheDocument();
  });
});
