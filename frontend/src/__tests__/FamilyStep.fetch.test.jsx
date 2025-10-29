import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import FamilyStep from "../components/Onboarding/FamilyStep";
import "@testing-library/jest-dom";

// Mock notify utils to avoid real toasts
vi.mock("../utils/toast", () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
}));

// Mock supabase client used by the component
vi.mock("../supabaseClient", () => {
  // We'll provide mock implementations per test by replacing these functions
  return {
    supabase: {
      auth: { getUser: vi.fn() },
      from: vi.fn(() => ({ select: vi.fn() })),
    },
  };
});

import { supabase } from "../supabaseClient";
import { notifyError, notifySuccess } from "../utils/toast";

describe("FamilyStep fetch", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("shows loading then renders items when fetch returns data", async () => {
    // mock getUser
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });

    const fakeList = [
      { id: "1", name: "Alice", relation: "Spouse", created_at: "2025-01-01T00:00:00Z" },
      { id: "2", name: "Bob", relation: "Son", created_at: "2025-02-01T00:00:00Z" },
    ];

    const selectMock = vi.fn().mockResolvedValue({ data: fakeList, error: null });
    const fromMock = vi.fn(() => ({ select: selectMock }));
    supabase.from = fromMock;

    render(<FamilyStep />);

    // loading state visible
    expect(screen.getByText(/Add your family members/i)).toBeInTheDocument();
    expect(screen.getByTestId("family-loading")).toBeInTheDocument();

    // wait for items to render
    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });

  it("shows empty state when no members", async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user-2" } }, error: null });
    const selectMock = vi.fn().mockResolvedValue({ data: [], error: null });
    supabase.from = vi.fn(() => ({ select: selectMock }));

    render(<FamilyStep />);

    // wait for empty state
    await waitFor(() => {
      expect(screen.getByText(/No members added/i)).toBeInTheDocument();
    });
  });

  it("shows error when fetch fails", async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user-3" } }, error: null });
    const selectMock = vi.fn().mockResolvedValue({ data: null, error: { message: "db error" } });
    supabase.from = vi.fn(() => ({ select: selectMock }));

    render(<FamilyStep />);

    await waitFor(() => {
      expect(screen.getByTestId("family-error")).toBeInTheDocument();
      expect(notifyError).toHaveBeenCalled();
    });
  });
});
