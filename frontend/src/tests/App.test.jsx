import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "../App";
// Mock OnboardingWizard and DashboardHomeTab to avoid real rendering and network calls
vi.mock("../components/OnboardingWizard/OnboardingWizard.jsx", () => ({
  __esModule: true,
  default: () => <div>Profile</div>,
}));
vi.mock("../components/DashboardHomeTab", () => ({
  __esModule: true,
  default: () => <div>Dashboard</div>,
}));
vi.mock("../ForgotPassword", () => ({
  __esModule: true,
  default: () => <div>Forgot Password</div>,
}));
import * as supabaseAuth from "../supabaseAuth";
import { vi } from "vitest";
vi.mock("../supabaseAuth");

const mockUser = { id: "test-user-id", email: "test@example.com" };

// Helper to render App with router and initial route
function renderWithRouter(route = "/") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppRoutes />
    </MemoryRouter>
  );
}

describe("AppRoutes", () => {
  it("redirects to onboarding if not onboarded", async () => {
    supabaseAuth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
    });
    supabaseAuth.fetchProfile = vi
      .fn()
      .mockResolvedValue({ is_onboarded: false });

    renderWithRouter("/dashboard");

    try {
      await waitFor(
        () => {
          expect(screen.getByText(/profile/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    } catch (e) {
      // Print the DOM for debugging
      // eslint-disable-next-line no-console
      console.log(
        "DOM after onboarding redirect fail:\n",
        document.body.innerHTML
      );
      throw e;
    }
  });

  it("redirects to dashboard if onboarded", async () => {
    supabaseAuth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
    });
    supabaseAuth.fetchProfile = vi
      .fn()
      .mockResolvedValue({ is_onboarded: true });

    renderWithRouter("/dashboard");

    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
  });

  it("redirects to login if no user session", async () => {
    supabaseAuth.getSession.mockResolvedValue({ user: null });
    renderWithRouter("/dashboard");
    await waitFor(() => {
      expect(screen.getAllByText(/login/i).length).toBeGreaterThan(0);
    });
  });

  it("shows forgot password page", async () => {
    renderWithRouter("/forgot-password");
    await waitFor(() => {
      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });
  });
});
