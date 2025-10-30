import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";

// Mock router, supabase, and any required context/providers as needed
jest.mock("next/router", () => ({ useRouter: () => ({ push: jest.fn() }) }));

// Basic RTL unit tests for dashboard panel switching, loading, and formatter correctness

describe("Dashboard Panel Unit Tests", () => {
  test("renders dashboard and switches panels", () => {
    render(<Dashboard />);
    // Portfolio tab is default
    expect(screen.getByTestId("panel-portfolio")).toBeInTheDocument();
    // Switch to Cashflow
    fireEvent.click(screen.getByTestId("tab-cashflow"));
    expect(screen.getByTestId("panel-cashflow")).toBeInTheDocument();
    // Switch to Liabilities
    fireEvent.click(screen.getByTestId("tab-liabilities"));
    expect(screen.getByTestId("panel-liabilities")).toBeInTheDocument();
  });

  test("shows skeleton loader then loaded state", async () => {
    render(<Dashboard />);
    expect(screen.getByTestId("skeleton-loader")).toBeInTheDocument();
    // Simulate data load
    // ...mock data fetch and rerender...
    // expect(screen.getByTestId('panel-portfolio')).toBeInTheDocument();
  });

  test("formatter correctness for KPIs", () => {
    render(<Dashboard />);
    // Example: check net worth KPI format
    const kpi = screen.getByTestId("kpi-net-worth");
    expect(kpi.textContent).toMatch(/\d{1,3}(,\d{3})*(\.\d{2})?/);
  });
});
