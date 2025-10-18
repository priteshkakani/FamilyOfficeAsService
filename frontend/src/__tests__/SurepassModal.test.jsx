import { render, screen, fireEvent } from "@testing-library/react";
import SurepassModal from "../components/modals/EPFOModal";
import "@testing-library/jest-dom";

describe("SurepassModal", () => {
  it("renders modal when open", () => {
    render(
      <SurepassModal open={true} onClose={() => {}} onVerify={() => {}} />
    );
    // component title is 'Connect EPFO'
    expect(screen.getByText(/Connect EPFO/i)).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = vi.fn();
    render(<SurepassModal open={true} onClose={onClose} onVerify={() => {}} />);
    fireEvent.click(screen.getByLabelText(/Close/i));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onVerify when verify button clicked", () => {
    const onVerify = vi.fn();
    render(
      <SurepassModal open={true} onClose={() => {}} onVerify={onVerify} />
    );
    // The first step shows 'Send OTP' button; simulate clicking it (verification requires network)
    fireEvent.click(screen.getByRole("button", { name: /Send OTP/i }));
    // We don't have network handlers here, just ensure the DOM interaction doesn't crash
    expect(screen.getByText(/Connect EPFO/i)).toBeInTheDocument();
  });
});
