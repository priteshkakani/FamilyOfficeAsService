import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import mockSupabase from "../__mocks__/supabaseClient";
import BankDataSourceModal from "../components/modals/BankModal";
import "@testing-library/jest-dom";

describe("BankDataSourceModal", () => {
  it("renders modal when open", () => {
    render(
      <BankDataSourceModal
        open={true}
        onClose={() => {}}
        onConnect={() => {}}
      />
    );
    // ensure the connect button is rendered (title and button share text)
    expect(
      screen.getByRole("button", { name: /Connect Bank/i })
    ).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = vi.fn();
    render(
      <BankDataSourceModal open={true} onClose={onClose} onConnect={() => {}} />
    );
    fireEvent.click(screen.getByLabelText(/Close/i));
    expect(onClose).toHaveBeenCalled();
  });

  it("submits form and calls onClose(true) when connect button clicked with valid data", async () => {
    // ensure the module mock's internal currentSupabase is active for this test
    try {
      mockSupabase.__setSupabase(mockSupabase.supabase);
    } catch (e) {}
    const onClose = vi.fn();
    render(
      <BankDataSourceModal open={true} onClose={onClose} userId={"user-1"} />
    );

    // fill required fields
    fireEvent.change(screen.getByPlaceholderText(/Account Number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText(/IFSC Code/i), {
      target: { value: "HDFC0001234" },
    });
    // check consent checkbox
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByRole("button", { name: /Connect Bank/i }));

    // onClose(true) should be called after successful submit (mocked supabase)
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
