/// <reference types="vitest/globals" />
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import OnboardingWizard from "../src/components/OnboardingWizard/OnboardingWizard.jsx";

// Mock useNavigate if used inside OnboardingWizard
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => vi.fn(),
}));

describe("OnboardingWizard", () => {
  it("renders step 1 (Profile), fills the form, clicks next, and shows step 2 (Family)", async () => {
    render(<OnboardingWizard />);

    // Step 1: Profile should be visible
    expect(screen.getByText(/profile/i)).toBeInTheDocument();

    // Fill profile form fields (adjust selectors as needed)
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Pritesh Kakani" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/mobile/i), {
      target: { value: "9999999999" },
    });
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: "Pune" },
    });
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: "India" },
    });
    fireEvent.change(screen.getByLabelText(/dob/i), {
      target: { value: "1990-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/occupation/i), {
      target: { value: "Engineer" },
    });
    fireEvent.change(screen.getByLabelText(/income range/i), {
      target: { value: "10-20L" },
    });

    // Click next
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    // Step 2: Family should be visible
    expect(await screen.findByText(/family/i)).toBeInTheDocument();
  });
});
