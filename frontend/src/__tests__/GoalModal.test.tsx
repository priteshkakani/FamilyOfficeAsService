import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Create a test wrapper with all necessary providers
const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

// Mock the auth context
const mockUser = { id: "test-user-id", email: "test@example.com" };
const mockUseAuth = vi.fn(() => ({
  user: mockUser,
  isLoading: false,
  signIn: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  resetPassword: vi.fn(),
  updatePassword: vi.fn(),
  updateEmail: vi.fn(),
  updateProfile: vi.fn(),
  refreshSession: vi.fn(),
}));

vi.mock("../contexts/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock supabase client
vi.mock("../supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}));

import { supabase } from "../supabaseClient";
import GoalModal from "../components/dashboard/GoalModal";
import { useAuth } from "../contexts/AuthProvider";
import { ClientProvider } from "../hooks/useClientContext";

describe("GoalModal", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("creates a goal when Save clicked (insert path)", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ 
      data: [{ 
        id: "goal-123", 
        user_id: "test-user-id",
        name: "Test Goal",
        target_amount: 10000,
        current_amount: 0,
        target_date: "2025-12-31",
        priority: "medium",
        status: "not_started"
      }], 
      error: null 
    });
    
    (supabase.from as jest.Mock).mockReturnValue({
      insert: mockInsert,
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn(),
    });

    const onClose = vi.fn();

    render(
      <TestWrapper>
        <GoalModal
          open={true}
          onClose={onClose}
          goal={null}
        />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(onClose).toHaveBeenCalledWith(true));
    expect(mockInsert).toHaveBeenCalledWith({
      user_id: "test-user-id",
      name: expect.any(String),
      target_amount: expect.any(Number),
      current_amount: expect.any(Number),
      target_date: expect.any(String),
      priority: expect.any(String),
      status: expect.any(String),
    });
  });

  test("updates a goal when Save clicked (update path)", async () => {
    const existing = {
      id: "goal-123",
      name: "Existing Goal",
      target_amount: 5000,
      current_amount: 1000,
      target_date: "2024-12-31",
      priority: "high",
      status: "in_progress",
      user_id: "test-user-id",
    };

    const mockUpdate = vi.fn().mockResolvedValue({ 
      data: [existing], 
      error: null 
    });
    
    (supabase.from as jest.Mock).mockReturnValue({
      update: mockUpdate,
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn(),
    });

    const onClose = vi.fn();

    render(
      <TestWrapper>
        <GoalModal
          open={true}
          onClose={onClose}
          goal={existing}
        />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(onClose).toHaveBeenCalledWith(true));
    expect(mockUpdate).toHaveBeenCalledWith({
      user_id: "test-user-id",
      name: existing.name,
      target_amount: existing.target_amount,
      current_amount: existing.current_amount,
      target_date: existing.target_date,
      priority: existing.priority,
      status: existing.status,
    });
  });
});
