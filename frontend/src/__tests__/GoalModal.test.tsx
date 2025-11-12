import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import * as supabaseClient from "../supabaseClient";

// Mock client context to avoid JSX import issues
vi.mock("../hooks/useClientContext", () => ({
  ClientProvider: ({ children }) => <div>{children}</div>,
  useClient: () => ({
    selectedClient: "client-123",
    setSelectedClient: vi.fn(),
  }),
}));

import GoalModal from "../components/dashboard/GoalModal";
import { ClientProvider } from "../hooks/useClientContext";
vi.mock("../supabaseClient");

describe("GoalModal", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("creates a goal when Save clicked (insert path)", async () => {
    const fakeFrom = vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: [{}], error: null }),
    });
    if (supabaseClient.__setSupabase)
      supabaseClient.__setSupabase({ from: fakeFrom });

    const onClose = vi.fn();

    const { getByText } = render(
      <ClientProvider>
        <GoalModal
          open={true}
          onClose={onClose}
          clientId={"client-123"}
          goal={null}
        />
      </ClientProvider>
    );

    fireEvent.click(getByText("Save"));

    await waitFor(() => expect(onClose).toHaveBeenCalledWith(true));
    expect(fakeFrom).toHaveBeenCalledWith("goals");
  });

  test("updates a goal when editing (update path)", async () => {
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
    const existing = { id: "g1", title: "Buy House" };

    const { getByText } = render(
      <ClientProvider>
        <GoalModal
          open={true}
          onClose={onClose}
          clientId={"client-123"}
          goal={existing}
        />
      </ClientProvider>
    );

    fireEvent.click(getByText("Save"));

    await waitFor(() => expect(onClose).toHaveBeenCalledWith(true));
  });
});
