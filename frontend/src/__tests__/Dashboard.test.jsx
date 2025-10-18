import { render, screen, waitFor, fireEvent } from "@testing-library/react";

// Ensure the real supabase client used by the app is mocked by our in-repo mock.
vi.mock("../supabaseClient", () => require("../__mocks__/supabaseClient"));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("renders summary cards with fetched values", async () => {
    const supabaseClient = await import("../supabaseClient");
    if (supabaseClient.__setSupabase)
      supabaseClient.__setSupabase({
        auth: {
          getSession: async () => ({
            data: { session: { user: { id: "test" } } },
          }),
        },
        from: vi.fn((table) => ({
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data:
              table === "profiles"
                ? {
                    net_worth: 1200000,
                    monthly_income: 50000,
                    monthly_expenses: 30000,
                  }
                : null,
            error: null,
          }),
          maybeSingle: vi.fn().mockResolvedValue({
            data:
              table === "profiles"
                ? {
                    net_worth: 1200000,
                    monthly_income: 50000,
                    monthly_expenses: 30000,
                  }
                : null,
            error: null,
          }),
        })),
      });
    const { default: Dashboard } = await import("../pages/Dashboard");
    render(<Dashboard />);
    expect(await screen.findByText(/Net Worth/i)).toBeInTheDocument();
    await waitFor(() => {
      const expected = `₹${new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
      }).format(1200000)}`;
      expect(screen.getByText(expected)).toBeInTheDocument();
    });
  });

  test("opens and closes Settings modal", async () => {
    const { default: Dashboard } = await import("../pages/Dashboard");
    render(<Dashboard />);
    // wait until loading is gone and topbar is visible
    await waitFor(() =>
      expect(screen.queryByText(/Loading Dashboard/i)).not.toBeInTheDocument()
    );
    const settingsBtn = screen.getByRole("button", { name: /settings/i });
    fireEvent.click(settingsBtn);
    // modal should appear with labelled heading
    expect(await screen.findByRole("dialog")).toBeVisible();
    const closeBtn = screen.getByLabelText(/close/i);
    fireEvent.click(closeBtn);
    await waitFor(() => {
      expect(screen.queryByTestId("settings-modal")).not.toBeInTheDocument();
    });
  });

  test("renders correct number of goals", async () => {
    const supabaseClient = await import("../supabaseClient");
    if (supabaseClient.__setSupabase)
      supabaseClient.__setSupabase({
        auth: {
          getSession: async () => ({
            data: { session: { user: { id: "test" } } },
          }),
        },
        from: vi.fn((table) => {
          if (table === "goals") {
            return {
              select: vi.fn().mockReturnThis(),
              gt: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              order: vi.fn().mockResolvedValue({
                data: [
                  {
                    title: "Goal 1",
                    target_amount: 1000,
                    target_date: new Date().toISOString(),
                    priority: "Low",
                  },
                  {
                    title: "Goal 2",
                    target_amount: 2000,
                    target_date: new Date().toISOString(),
                    priority: "High",
                  },
                ],
                error: null,
              }),
            };
          }
          return {
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          };
        }),
      });
    const { default: Dashboard } = await import("../pages/Dashboard");
    render(<Dashboard />);
    expect(await screen.findByText(/Upcoming Goals/i)).toBeInTheDocument();
    await waitFor(() => {
      const items = screen.getAllByTestId("goal-item");
      expect(items.length).toBe(2);
    });
  });

  test("charts mount without crash", async () => {
    const supabaseClient = await import("../supabaseClient");
    if (supabaseClient.__setSupabase)
      supabaseClient.__setSupabase({
        auth: {
          getSession: async () => ({
            data: { session: { user: { id: "test" } } },
          }),
        },
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        })),
      });
    const { default: Dashboard } = await import("../pages/Dashboard");
    render(<Dashboard />);
    expect(await screen.findByTestId("income-chart")).toBeInTheDocument();
    expect(screen.getByTestId("asset-allocation-chart")).toBeInTheDocument();
  });

  test("logout button calls signOut and navigates", async () => {
    const signOut = vi.fn();
    // Ensure supabase mock has auth getter
    const supabaseClient = await import("../supabaseClient");
    if (supabaseClient.__setSupabase) {
      supabaseClient.__setSupabase({
        auth: {
          signOut,
          getSession: async () => ({
            data: { session: { user: { id: "test" } } },
          }),
        },
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        })),
      });
    }
    const { default: Dashboard } = await import("../pages/Dashboard");
    render(<Dashboard />);
    // Wait for the dashboard to finish loading and render the logout button
    await waitFor(() =>
      expect(screen.queryByText(/Loading Dashboard/i)).not.toBeInTheDocument()
    );
    const logoutBtn = screen.queryByRole("button", { name: /logout/i });
    if (!logoutBtn)
      throw new Error("Logout button not found in Dashboard render");
    fireEvent.click(logoutBtn);
    await waitFor(() => expect(signOut).toHaveBeenCalled());
  });
});
