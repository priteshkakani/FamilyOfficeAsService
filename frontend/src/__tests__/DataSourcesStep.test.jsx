import { render, screen, fireEvent } from "@testing-library/react";
import DataSourcesStep from "../components/Onboarding/DataSourcesStep";
import "@testing-library/jest-dom";

describe("DataSourcesStep", () => {
  it("renders all data source tiles", () => {
    render(<DataSourcesStep />);
    expect(screen.getByText(/Bank/i)).toBeInTheDocument();
    expect(screen.getByText(/Mutual Funds/i)).toBeInTheDocument();
    expect(screen.getByText(/EPFO/i)).toBeInTheDocument();
  });

  it("opens and closes modal on click", () => {
    render(<DataSourcesStep />);
    fireEvent.click(screen.getByText(/Bank/i));
    expect(screen.getByText(/Connect Bank/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/Close/i));
    expect(screen.queryByText(/Connect Bank/i)).not.toBeInTheDocument();
  });
});
