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
import TaskModal from "../components/dashboard/TaskModal";
import { useAuth } from "../contexts/AuthProvider";

describe("TaskModal", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("creates a task when Save clicked (insert path)", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ 
      data: [{ 
        id: "task-123", 
        user_id: "test-user-id",
        title: "Test Task",
        description: "Test Description",
        due_date: "2025-12-31",
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
        <TaskModal
          open={true}
          onClose={onClose}
          task={null}
        />
      </TestWrapper>
    );

    const titleInput = document.querySelector(
      '[data-testid="task-modal"] input'
    );
    fireEvent.change(titleInput, { target: { value: "Test Task" } });

    fireEvent.click(getByText("Save"));

    await waitFor(() => expect(onClose).toHaveBeenCalledWith(true));
    expect(fakeFrom).toHaveBeenCalledWith("tasks");
  });

  test("updates a task when editing (update path)", async () => {
    // chainable mock for .update().eq().eq()
    const finalResult = Promise.resolve({ data: [{}], error: null });
    const eq2 = vi.fn().mockReturnValue(finalResult);
    const eq1 = vi.fn().mockReturnValue({ eq: eq2 });
    const update = vi.fn().mockReturnValue({ eq: eq1 });
    if (supabaseClient.__setSupabase)
      supabaseClient.__setSupabase({
        from: vi.fn().mockReturnValue({ update }),
      });

    const onClose = vi.fn();
    const existing = { id: "t1", title: "Old" };

    const { getByText } = render(
      <ClientProvider>
        <TaskModal
          open={true}
          onClose={onClose}
          clientId={"client-123"}
          task={existing}
        />
      </ClientProvider>
    );

    fireEvent.click(getByText("Save"));

    await waitFor(() => expect(onClose).toHaveBeenCalledWith(true));
  });
});
