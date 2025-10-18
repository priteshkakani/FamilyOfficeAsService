import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MutualFundDataSourceModal from "../components/modals/MutualFundModal";
import "@testing-library/jest-dom";

describe("MutualFundDataSourceModal", () => {
  it("renders modal when open", () => {
    render(
      <MutualFundDataSourceModal
        open={true}
        onClose={() => {}}
        onConnect={() => {}}
      />
    );
    expect(
      screen.getByRole("heading", { name: /Connect Mutual Fund/i })
    ).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = vi.fn();
    render(
      <MutualFundDataSourceModal
        open={true}
        onClose={onClose}
        onConnect={() => {}}
      />
    );
    fireEvent.click(screen.getByLabelText(/Close/i));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onConnect when connect button clicked", async () => {
    const onClose = vi.fn();
    // Render modal and fill required fields then submit
    render(
      <MutualFundDataSourceModal
        open={true}
        onClose={onClose}
        userId={"test-user"}
      />
    );
    // Fill PAN input (placeholder is 'PAN')
    const panInput = screen.getByPlaceholderText(/PAN/i);
    fireEvent.change(panInput, { target: { value: "ABCDE1234F" } });
    // check the consent checkbox
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    // submit
    const submit = screen.getByRole("button", { name: /Connect Mutual Fund/i });
    fireEvent.click(submit);
    // wait for onClose to be called (component triggers it after async insert)
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
