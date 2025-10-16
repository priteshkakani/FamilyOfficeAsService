import { render, screen, fireEvent } from "@testing-library/react";
import MutualFundDataSourceModal from "../components/Onboarding/MutualFundDataSourceModal";
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
    expect(screen.getByText(/Connect Mutual Fund/i)).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = jest.fn();
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

  it("calls onConnect when connect button clicked", () => {
    const onConnect = jest.fn();
    render(
      <MutualFundDataSourceModal
        open={true}
        onClose={() => {}}
        onConnect={onConnect}
      />
    );
    fireEvent.click(screen.getByText(/Connect/i));
    expect(onConnect).toHaveBeenCalled();
  });
});
