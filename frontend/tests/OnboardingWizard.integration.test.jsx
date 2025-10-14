/// <reference types="vitest/globals" />
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import OnboardingWizard from "../src/components/OnboardingWizard/OnboardingWizard.jsx";

describe("OnboardingWizard", () => {
  it("renders step 1 (Profile), submits, and advances to step 2 (Family)", async () => {
    render(<OnboardingWizard />);

    // Step 1: Profile
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/mobile/i), {
      target: { value: "9999999999" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /next|submit|continue/i })
    );

    // Step 2: Family
    expect(await screen.findByText(/family/i)).toBeInTheDocument();
  });
});
