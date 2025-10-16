import { render, screen, fireEvent } from "@testing-library/react";
import EPFODataSourceModal from "../components/Onboarding/EPFODataSourceModal";
import "@testing-library/jest-dom";

describe("EPFODataSourceModal", () => {
  it("renders modal when open", () => {
    render(
      <EPFODataSourceModal
        open={true}
        onClose={() => {}}
        onConnect={() => {}}
      />
    );
    expect(screen.getByText(/Connect EPFO/i)).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = jest.fn();
    render(
      <EPFODataSourceModal open={true} onClose={onClose} onConnect={() => {}} />
    );
    fireEvent.click(screen.getByLabelText(/Close/i));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onConnect when connect button clicked", () => {
    const onConnect = jest.fn();
    render(
      <EPFODataSourceModal
        open={true}
        onClose={() => {}}
        onConnect={onConnect}
      />
    );
    fireEvent.click(screen.getByText(/Connect/i));
    expect(onConnect).toHaveBeenCalled();
  });
});
