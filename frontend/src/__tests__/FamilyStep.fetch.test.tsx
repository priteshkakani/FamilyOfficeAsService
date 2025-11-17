import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
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

// Mock notify utils to avoid real toasts
vi.mock("../utils/toast", () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
}));

// Mock supabase client used by the component
vi.mock("../supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}));

import { supabase } from "../supabaseClient";
import { notifyError, notifySuccess } from "../utils/toast";

describe("FamilyStep fetch", () => {
  const mockFamilyMembers = [
    {
      id: "1",
      name: "Alice",
      relation: "Spouse",
      user_id: "test-user-id",
      created_at: "2025-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "Bob",
      relation: "Son",
      user_id: "test-user-id",
      created_at: "2025-02-01T00:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    // Reset the mock implementation for useAuth
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: "test-user-id" },
      isLoading: false,
    });
  });

  it("shows loading then renders items when fetch returns data", async () => {
    // Mock the supabase response
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockOrder = vi.fn().mockResolvedValue({
      data: mockFamilyMembers,
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      order: mockOrder,
    });

    const fakeList = [
      {
        id: "1",
        name: "Alice",
        relation: "Spouse",
        created_at: "2025-01-01T00:00:00Z",
      },
      {
        id: "2",
        name: "Bob",
        relation: "Son",
        created_at: "2025-02-01T00:00:00Z",
      },
    ];

    const selectMock = vi
      .fn()
      .mockResolvedValue({ data: fakeList, error: null });
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
    supabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-2" } },
      error: null,
    });
    const selectMock = vi.fn().mockResolvedValue({ data: [], error: null });
    supabase.from = vi.fn(() => ({ select: selectMock }));

    render(<FamilyStep />);

    // wait for empty state
    await waitFor(() => {
      expect(screen.getByText(/No members added/i)).toBeInTheDocument();
    });
  });

  it("shows error when fetch fails", async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-3" } },
      error: null,
    });
    const selectMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "db error" } });
    supabase.from = vi.fn(() => ({ select: selectMock }));

    render(<FamilyStep />);

    await waitFor(() => {
      expect(screen.getByTestId("family-error")).toBeInTheDocument();
      expect(notifyError).toHaveBeenCalled();
    });
  });
});
