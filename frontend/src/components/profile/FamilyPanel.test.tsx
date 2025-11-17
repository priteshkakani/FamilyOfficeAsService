import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import FamilyPanel from "./FamilyPanel";

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

vi.mock("../../contexts/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock hooks and utilities
vi.mock("./familyHooks", () => ({
  useFamilyMembers: () => ({
    family: [
      {
        id: 1,
        user_id: "test-user-id",
        name: "John Doe",
        relation: "Spouse",
        pan: "ABCDE1234F",
        aadhaar: "123456789012",
        dob: "1990-01-01",
        profession: "Engineer",
        marital_status: "Married",
      },
    ],
    isLoading: false,
    error: null,
    refetch: vi.fn(),
    totalPages: 1,
  }),
  useAddFamilyMember: () => ({ 
    mutateAsync: vi.fn().mockResolvedValue({ id: 2 }) 
  }),
  useEditFamilyMember: () => ({ 
    mutateAsync: vi.fn().mockResolvedValue({}) 
  }),
  useDeleteFamilyMember: () => ({ 
    mutateAsync: vi.fn().mockResolvedValue({}) 
  }),
  maskPan: (pan) => pan,
  maskAadhaar: (aadhaar) => aadhaar,
}));

describe("FamilyPanel", () => {
  it("renders family table and member", () => {
    render(
      <TestWrapper>
        <FamilyPanel profileSaved={true} advisorMode={false} />
      </TestWrapper>
    );
    expect(screen.getByTestId("profile-family-panel")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Spouse")).toBeInTheDocument();
  });

  it("shows add modal when Add Family Member is clicked", () => {
    render(
      <TestWrapper>
        <FamilyPanel profileSaved={true} advisorMode={false} />
      </TestWrapper>
    );
    fireEvent.click(screen.getByTestId("family-add"));
    expect(screen.getByTestId("family-add-modal")).toBeInTheDocument();
  });

  it("shows edit modal when Edit is clicked", () => {
    render(
      <TestWrapper>
        <FamilyPanel profileSaved={true} advisorMode={false} />
      </TestWrapper>
    );
    fireEvent.click(screen.getByTestId("edit-family-1"));
    expect(screen.getByTestId("family-edit-1")).toBeInTheDocument();
  });

  it("shows view modal when View is clicked", () => {
    render(
      <TestWrapper>
        <FamilyPanel profileSaved={true} advisorMode={false} />
      </TestWrapper>
    );
    fireEvent.click(screen.getByTestId("menu-family-1"));
    expect(screen.getByTestId("family-view-1")).toBeInTheDocument();
  });

  it("shows delete confirm when Delete is clicked", () => {
    render(
      <TestWrapper>
        <FamilyPanel profileSaved={true} advisorMode={false} />
      </TestWrapper>
    );
    fireEvent.click(screen.getByTestId("delete-family-1"));
    expect(screen.getByTestId("family-delete-confirm")).toBeInTheDocument();
  });
});
