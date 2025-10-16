import { render, screen, fireEvent } from "@testing-library/react";
import LiabilitiesSummaryStep from "../components/Onboarding/LiabilitiesSummaryStep";
import "@testing-library/jest-dom";

describe("LiabilitiesSummaryStep", () => {
  it("renders liability fields", () => {
    render(<LiabilitiesSummaryStep data={{}} onChange={() => {}} />);
    expect(screen.getByLabelText(/Total Liabilities/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monthly EMI/i)).toBeInTheDocument();
  });

  it("validates required fields", () => {
    render(
      <LiabilitiesSummaryStep
        data={{}}
        onChange={() => {}}
        showValidation={true}
      />
    );
    fireEvent.change(screen.getByLabelText(/Total Liabilities/i), {
      target: { value: "" },
    });
    fireEvent.blur(screen.getByLabelText(/Total Liabilities/i));
    expect(screen.getByText(/Liabilities are required/i)).toBeInTheDocument();
  });

  it("calls onChange on input", () => {
    const onChange = jest.fn();
    render(<LiabilitiesSummaryStep data={{}} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/Total Liabilities/i), {
      target: { value: "100000" },
    });
    expect(onChange).toHaveBeenCalled();
  });
});
