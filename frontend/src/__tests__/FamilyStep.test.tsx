import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FamilyStep from "../components/Onboarding/FamilyStep";
import "@testing-library/jest-dom";

describe("FamilyStep", () => {
  it("renders family member fields", () => {
    render(<FamilyStep data={{ family_members: [] }} onChange={() => {}} />);
    // heading text in component
    expect(screen.getByText(/Add your family members/i)).toBeInTheDocument();
    // Add button is available via testid
    expect(screen.getByTestId("family-add-btn")).toBeInTheDocument();
  });

  it("adds a new family member", () => {
    const onChange = vi.fn();
    render(<FamilyStep data={{ family_members: [] }} onChange={onChange} />);
    // enter a name so addMember will call onChange
    fireEvent.change(screen.getByTestId("family-name-input"), {
      target: { value: "John" },
    });
    fireEvent.click(screen.getByTestId("family-add-btn"));
    // Wait for async updates (supabase mock) to trigger onChange
    return waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });

  it("renders existing family members from props", () => {
    render(
      <FamilyStep
        data={{ family_members: [{ name: "", relation: "" }] }}
        onChange={() => {}}
      />
    );
    expect(screen.getByTestId("family-member-row-0")).toBeInTheDocument();
  });
});
