/// <reference types="vitest/globals" />
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import OnboardingWizard from "../src/components/OnboardingWizard/OnboardingWizard.jsx";

describe("OnboardingWizard", () => {
  it("renders step 1 (Profile), submits, and advances to step 2 (Family)", async () => {
    render(<OnboardingWizard />);

    // Step 1: Profile (check the visible heading)
    expect(
      screen.getByRole("heading", { name: /profile/i })
    ).toBeInTheDocument();
    const nameInputs = screen.getAllByLabelText(/name/i);
    fireEvent.change(nameInputs[0], {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/mobile/i), {
      target: { value: "9999999999" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /next|submit|continue|sign up/i })
    );

    // Step 2: Family (visible heading)
    expect(
      await screen.findByRole("heading", { name: /family/i })
    ).toBeInTheDocument();
  });
});
