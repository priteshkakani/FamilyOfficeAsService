import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import DataSourcesStep from "../components/Onboarding/DataSourcesStep";
import "@testing-library/jest-dom";

describe("DataSourcesStep", () => {
  it("renders all data source tiles", () => {
    render(<DataSourcesStep />);
    expect(screen.getByText(/Bank/i)).toBeInTheDocument();
    expect(screen.getByText(/Mutual Funds/i)).toBeInTheDocument();
    expect(screen.getByText(/EPFO/i)).toBeInTheDocument();
  });

  it("opens and closes modal on click", async () => {
    render(<DataSourcesStep />);
    // Click the bank tile by test id
    fireEvent.click(screen.getByTestId("ds-bank-open"));

    // Wait for modal to appear
    const modal = await screen.findByRole("dialog");
    expect(modal).toBeTruthy();
    const m = within(modal);
    // Expect the modal title testid specifically
    expect(m.getByTestId("modal-title")).toBeInTheDocument();

    // Close the modal using the close button inside the modal
    fireEvent.click(m.getByLabelText(/Close/i));
    await waitFor(() => {
      expect(document.querySelector('[aria-modal="true"]')).toBeNull();
    });
  });
});
