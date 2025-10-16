import { render, screen, fireEvent } from "@testing-library/react";
import IncomeExpenseStep from "../components/Onboarding/IncomeExpenseStep";
import "@testing-library/jest-dom";

describe("IncomeExpenseStep", () => {
  it("renders income and expense fields", () => {
    render(<IncomeExpenseStep data={{}} onChange={() => {}} />);
    expect(screen.getByLabelText(/Monthly Income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monthly Expenses/i)).toBeInTheDocument();
  });

  it("validates required fields", () => {
    render(
      <IncomeExpenseStep data={{}} onChange={() => {}} showValidation={true} />
    );
    fireEvent.change(screen.getByLabelText(/Monthly Income/i), {
      target: { value: "" },
    });
    fireEvent.blur(screen.getByLabelText(/Monthly Income/i));
    expect(screen.getByText(/Income is required/i)).toBeInTheDocument();
  });

  it("calls onChange on input", () => {
    const onChange = jest.fn();
    render(<IncomeExpenseStep data={{}} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/Monthly Income/i), {
      target: { value: "50000" },
    });
    expect(onChange).toHaveBeenCalled();
  });
});
