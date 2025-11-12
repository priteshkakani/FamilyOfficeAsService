import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import * as supabaseClient from "../supabaseClient";

// Mock the client context so tests don't import JSX-containing module at top-level
vi.mock("../hooks/useClientContext", () => ({
  ClientProvider: ({ children }) => <div>{children}</div>,
  useClient: () => ({
    selectedClient: "client-123",
    setSelectedClient: vi.fn(),
  }),
}));

import TaskModal from "../components/dashboard/TaskModal";
import { ClientProvider } from "../hooks/useClientContext";
vi.mock("../supabaseClient");

describe("TaskModal", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("creates a task when Save clicked (insert path)", async () => {
    const fakeFrom = vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: [{}], error: null }),
    });
    if (supabaseClient.__setSupabase)
      supabaseClient.__setSupabase({ from: fakeFrom });

    const onClose = vi.fn();

    const { getByText, getByLabelText } = render(
      <ClientProvider>
        <TaskModal
          open={true}
          onClose={onClose}
          clientId={"client-123"}
          task={null}
        />
      </ClientProvider>
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
