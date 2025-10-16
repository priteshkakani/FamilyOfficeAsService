import { render, screen, fireEvent } from "@testing-library/react";
import BankDataSourceModal from "../components/Onboarding/BankDataSourceModal";
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
    expect(screen.getByText(/Connect Bank/i)).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = jest.fn();
    render(
      <BankDataSourceModal open={true} onClose={onClose} onConnect={() => {}} />
    );
    fireEvent.click(screen.getByLabelText(/Close/i));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onConnect when connect button clicked", () => {
    const onConnect = jest.fn();
    render(
      <BankDataSourceModal
        open={true}
        onClose={() => {}}
        onConnect={onConnect}
      />
    );
    fireEvent.click(screen.getByText(/Connect/i));
    expect(onConnect).toHaveBeenCalled();
  });
});
