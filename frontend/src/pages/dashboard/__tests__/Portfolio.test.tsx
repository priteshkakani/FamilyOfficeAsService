import React from "react";
import { render, screen } from "@testing-library/react";
import Portfolio from "../dashboard/Portfolio";

describe("Portfolio Dashboard", () => {
  it("renders without crashing", () => {
    render(<Portfolio />);
    expect(screen.getByTestId("nav-portfolio")).toBeInTheDocument();
  });

  it("shows loading state if loading", () => {
    // You may need to mock useAuth to simulate loading
    // Example:
    // jest.mock("../../contexts/AuthProvider", () => ({ useAuth: () => ({ authLoading: true }) }));
    // render(<Portfolio />);
    // expect(screen.getByText(/Loading portfolio/i)).toBeInTheDocument();
  });

  // Add more tests for tabs, error states, and data rendering as needed
});
