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

    // Step 1: Profile should be visible (heading)
    expect(screen.getByRole("heading", { name: /profile/i })).toBeTruthy();

    // Fill profile form fields (disambiguate 'name' field)
    const nameInputs = screen.getAllByLabelText(/name/i);
    fireEvent.change(nameInputs[0], {
      target: { value: "Pritesh Kakani" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/mobile/i), {
      target: { value: "9999999999" },
    });
    // Only fill fields that exist in the form
    // fireEvent.change(screen.getByLabelText(/city/i), { target: { value: "Pune" } });
    // fireEvent.change(screen.getByLabelText(/country/i), { target: { value: "India" } });
    // fireEvent.change(screen.getByLabelText(/dob/i), { target: { value: "1990-01-01" } });
    // fireEvent.change(screen.getByLabelText(/occupation/i), { target: { value: "Engineer" } });
    // fireEvent.change(screen.getByLabelText(/income range/i), { target: { value: "10-20L" } });

    // Click next/sign up
    fireEvent.click(
      screen.getByRole("button", { name: /next|submit|continue|sign up/i })
    );

    // Step 2: Family should be visible
    expect(
      await screen.findByRole("heading", { name: /family/i })
    ).toBeTruthy();
  });
});
