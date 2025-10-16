import { render, screen, fireEvent } from "@testing-library/react";
import ProfileStep from "../components/Onboarding/ProfileStep";
import "@testing-library/jest-dom";

describe("ProfileStep", () => {
  it("renders all fields", () => {
    render(<ProfileStep data={{}} onChange={() => {}} />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
  });

  it("validates required fields", () => {
    render(<ProfileStep data={{}} onChange={() => {}} showValidation={true} />);
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "" },
    });
    fireEvent.blur(screen.getByLabelText(/Full Name/i));
    expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
  });

  it("calls onChange on input", () => {
    const onChange = jest.fn();
    render(<ProfileStep data={{}} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John" },
    });
    expect(onChange).toHaveBeenCalled();
  });
});
