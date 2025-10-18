import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
// Ensure supabaseAuth is mocked before AppRoutes/useAuthState imports it.
vi.mock("../supabaseAuth");
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
  return (async () => {
    // Always dynamically import App to ensure the current test's global overrides
    // are observed at module initialization time (avoid using a cached AppRoutes).
    const mod = await import("../App");
    const AppRoutesLocal = mod.AppRoutes;
    return render(
      <MemoryRouter initialEntries={[route]}>
        <AppRoutesLocal />
      </MemoryRouter>
    );
  })();
}

describe("AppRoutes", () => {
  afterEach(() => {
    try {
      delete globalThis.__TEST_AUTH_STATE;
    } catch (e) {
      globalThis.__TEST_AUTH_STATE = undefined;
    }
  });
  it("redirects to onboarding if not onboarded", async () => {
    // Provide a synchronous test auth state so ProtectedRoute renders immediately
    globalThis.__TEST_AUTH_STATE = {
      loading: false,
      session: { user: mockUser },
      profile: { is_onboarded: false },
    };
    supabaseAuth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
    });
    supabaseAuth.fetchProfile = vi
      .fn()
      .mockResolvedValue({ is_onboarded: false });
    await renderWithRouter("/dashboard");

    try {
      // Wait for any loading placeholder to be removed, then assert
      await waitFor(
        () => {
          expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
        },
        { timeout: 2000 }
      );
      // Query a specific onboarding element to avoid ambiguous matches with the step pill
      const current = await screen.findByTestId(
        "onboarding-current-step-profile"
      );
      expect(current).toBeInTheDocument();
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
    globalThis.__TEST_AUTH_STATE = {
      loading: false,
      session: { user: mockUser },
      profile: { is_onboarded: true },
    };
    supabaseAuth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
    });
    supabaseAuth.fetchProfile = vi
      .fn()
      .mockResolvedValue({ is_onboarded: true });
    await renderWithRouter("/dashboard");

    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
  });

  it("redirects to login if no user session", async () => {
    globalThis.__TEST_AUTH_STATE = {
      loading: false,
      session: null,
      profile: null,
    };
    supabaseAuth.getSession.mockResolvedValue({ user: null });
    await renderWithRouter("/dashboard");
    await waitFor(() => {
      expect(screen.getAllByText(/login/i).length).toBeGreaterThan(0);
    });
  });

  it("shows forgot password page", async () => {
    await renderWithRouter("/forgot-password");
    await waitFor(() => {
      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });
  });
});
