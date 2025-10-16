import { render, screen, fireEvent } from "@testing-library/react";
import SurepassModal from "../components/Onboarding/SurepassModal";
import "@testing-library/jest-dom";

describe("SurepassModal", () => {
  it("renders modal when open", () => {
    render(
      <SurepassModal open={true} onClose={() => {}} onVerify={() => {}} />
    );
    expect(screen.getByText(/Verify with Surepass/i)).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = jest.fn();
    render(<SurepassModal open={true} onClose={onClose} onVerify={() => {}} />);
    fireEvent.click(screen.getByLabelText(/Close/i));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onVerify when verify button clicked", () => {
    const onVerify = jest.fn();
    render(
      <SurepassModal open={true} onClose={() => {}} onVerify={onVerify} />
    );
    fireEvent.click(screen.getByText(/Verify/i));
    expect(onVerify).toHaveBeenCalled();
  });
});
