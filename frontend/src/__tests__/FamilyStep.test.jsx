import { render, screen, fireEvent } from "@testing-library/react";
import FamilyStep from "../components/Onboarding/FamilyStep";
import "@testing-library/jest-dom";

describe("FamilyStep", () => {
  it("renders family member fields", () => {
    render(<FamilyStep data={{ family: [] }} onChange={() => {}} />);
    expect(screen.getByText(/Add Family Member/i)).toBeInTheDocument();
  });

  it("adds a new family member", () => {
    const onChange = jest.fn();
    render(<FamilyStep data={{ family: [] }} onChange={onChange} />);
    fireEvent.click(screen.getByText(/Add Family Member/i));
    expect(onChange).toHaveBeenCalled();
  });

  it("validates required fields for family member", () => {
    render(
      <FamilyStep
        data={{ family: [{ name: "", relation: "" }] }}
        onChange={() => {}}
        showValidation={true}
      />
    );
    expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
  });
});
