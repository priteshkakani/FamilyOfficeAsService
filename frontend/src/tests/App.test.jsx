import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import * as supabaseAuth from "../supabaseAuth";

jest.mock("../supabaseAuth");

const mockUser = { id: "test-user-id", email: "test@example.com" };

describe("Onboarding and Auth Routing", () => {
  afterEach(() => jest.clearAllMocks());

  it("redirects to onboarding if not onboarded", async () => {
    supabaseAuth.getSession.mockResolvedValue({ user: mockUser });
    supabaseAuth.fetchProfile = jest
      .fn()
      .mockResolvedValue({ is_onboarded: false });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/onboarding/i)).toBeInTheDocument();
    });
  });

  it("allows access to dashboard if onboarded", async () => {
    supabaseAuth.getSession.mockResolvedValue({ user: mockUser });
    supabaseAuth.fetchProfile = jest
      .fn()
      .mockResolvedValue({ is_onboarded: true });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
  });

  it("shows forgot password page", async () => {
    render(
      <MemoryRouter initialEntries={["/forgot-password"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/reset your password/i)).toBeInTheDocument();
  });
});
