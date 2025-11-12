import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FamilyPanel from "./FamilyPanel";

// Mock hooks and utilities
jest.mock("./familyHooks", () => ({
  useFamilyMembers: () => ({
    family: [
      {
        id: 1,
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
    refetch: jest.fn(),
    totalPages: 1,
  }),
  useAddFamilyMember: () => ({ mutateAsync: jest.fn() }),
  useEditFamilyMember: () => ({ mutateAsync: jest.fn() }),
  useDeleteFamilyMember: () => ({ mutateAsync: jest.fn() }),
  maskPan: (pan) => pan,
  maskAadhaar: (aadhaar) => aadhaar,
}));

describe("FamilyPanel", () => {
  it("renders family table and member", () => {
    render(
      <FamilyPanel clientId={123} profileSaved={true} advisorMode={false} />
    );
    expect(screen.getByTestId("profile-family-panel")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Spouse")).toBeInTheDocument();
  });

  it("shows add modal when Add Family Member is clicked", () => {
    render(
      <FamilyPanel clientId={123} profileSaved={true} advisorMode={false} />
    );
    fireEvent.click(screen.getByTestId("family-add"));
    expect(screen.getByTestId("family-add-modal")).toBeInTheDocument();
  });

  it("shows edit modal when Edit is clicked", () => {
    render(
      <FamilyPanel clientId={123} profileSaved={true} advisorMode={false} />
    );
    fireEvent.click(screen.getByTestId("edit-family-1"));
    expect(screen.getByTestId("family-edit-1")).toBeInTheDocument();
  });

  it("shows view modal when View is clicked", () => {
    render(
      <FamilyPanel clientId={123} profileSaved={true} advisorMode={false} />
    );
    fireEvent.click(screen.getByTestId("menu-family-1"));
    expect(screen.getByTestId("family-view-1")).toBeInTheDocument();
  });

  it("shows delete confirm when Delete is clicked", () => {
    render(
      <FamilyPanel clientId={123} profileSaved={true} advisorMode={false} />
    );
    fireEvent.click(screen.getByTestId("delete-family-1"));
    expect(screen.getByTestId("family-delete-confirm")).toBeInTheDocument();
  });
});
