import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "../pages/Dashboard";
import * as supabaseClient from "../supabaseClient";

jest.mock("../supabaseClient");

describe("Dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders summary cards with fetched values", async () => {
    supabaseClient.supabase = {
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            net_worth: 1200000,
            monthly_income: 50000,
            monthly_expenses: 30000,
          },
          error: null,
        }),
      })),
    };
    render(<Dashboard />);
    expect(await screen.findByText(/Net Worth/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("₹1,200,000")).toBeInTheDocument();
    });
  });

  test("opens and closes Settings modal", async () => {
    render(<Dashboard />);
    const settingsBtn = screen.getByRole("button", { name: /settings/i });
    userEvent.click(settingsBtn);
    expect(await screen.findByText(/Monthly Income/i)).toBeVisible();
    const closeBtn = screen.getByLabelText(/close/i);
    userEvent.click(closeBtn);
    await waitFor(() => {
      expect(screen.queryByText(/Monthly Income/i)).not.toBeInTheDocument();
    });
  });

  test("renders correct number of goals", async () => {
    supabaseClient.supabase = {
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            goals: [
              { id: 1, name: "Goal 1" },
              { id: 2, name: "Goal 2" },
            ],
          },
          error: null,
        }),
      })),
    };
    render(<Dashboard />);
    expect(await screen.findByText(/Upcoming Goals/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByTestId("goal-item").length).toBe(2);
    });
  });

  test("charts mount without crash", async () => {
    render(<Dashboard />);
    expect(await screen.findByTestId("income-chart")).toBeInTheDocument();
    expect(screen.getByTestId("asset-allocation-chart")).toBeInTheDocument();
  });

  test("logout button calls signOut and navigates", async () => {
    const signOut = jest.fn();
    jest
      .spyOn(supabaseClient.supabase, "auth", "get")
      .mockReturnValue({ signOut });
    render(<Dashboard />);
    const logoutBtn = screen.getByRole("button", { name: /logout/i });
    userEvent.click(logoutBtn);
    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
    });
  });
});
