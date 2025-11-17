import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FamilyStep from "../components/Onboarding/FamilyStep";
import { useAuth } from "../contexts/AuthProvider";
import "@testing-library/jest-dom";

// Mock the useAuth hook
vi.mock("../contexts/AuthProvider", () => ({
  useAuth: vi.fn(() => ({
    user: { id: "test-user-id" },
    isLoading: false,
  })),
}));

describe("FamilyStep", () => {
  it("renders family member fields", () => {
    render(<FamilyStep data={{ family_members: [] }} onChange={() => {}} />);
    expect(screen.getByText(/Add your family members/i)).toBeInTheDocument();
    expect(screen.getByTestId("family-add-btn")).toBeInTheDocument();
  });

  it("adds a new family member", async () => {
    const onChange = vi.fn();
    render(<FamilyStep data={{ family_members: [] }} onChange={onChange} />);
    
    fireEvent.change(screen.getByTestId("family-name-input"), {
      target: { value: "John" },
    });
    
    fireEvent.click(screen.getByTestId("family-add-btn"));
    
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });

  it("renders existing family members from props", () => {
    render(
      <FamilyStep
        data={{ family_members: [{ name: "Test User", relation: "Spouse" }] }}
        onChange={() => {}}
      />
    );
    expect(screen.getByTestId("family-member-row-0")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("shows loading state when user data is loading", () => {
    // Override the mock to simulate loading state
    (useAuth as jest.Mock).mockReturnValue({ 
      user: null, 
      isLoading: true 
    });
    
    render(<FamilyStep data={{ family_members: [] }} onChange={() => {}} />);
    expect(screen.getByTestId("family-loading")).toBeInTheDocument();
  });
});
