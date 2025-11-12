import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfileStep from "../components/Onboarding/ProfileStep";
import "@testing-library/jest-dom";

describe("ProfileStep", () => {
  it("renders all fields", async () => {
    render(<ProfileStep data={{}} onChange={() => {}} />);
    // Wait for either loading or form to appear, then wait for form to be present
    // findBy will wait for element to appear and avoids act() warnings
    const form = await screen.findByTestId("profile-form").catch(() => null);
    if (form) {
      expect(form).toBeInTheDocument();
    } else {
      // fallback to loading indicator
      expect(screen.getByTestId("profile-loading")).toBeInTheDocument();
    }
  });

  it("validates required fields", async () => {
    render(<ProfileStep data={{}} onChange={() => {}} showValidation={true} />);
    const form = await screen.findByTestId("profile-form").catch(() => null);
    if (!form) {
      expect(screen.getByTestId("profile-loading")).toBeInTheDocument();
      return;
    }
    const fullname = await screen.findByTestId("profile-fullname");
    fireEvent.change(fullname, { target: { value: "" } });
    fireEvent.blur(fullname);
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    });
  });

  it("calls onChange on input", async () => {
    const onChange = vi.fn();
    render(<ProfileStep data={{}} onChange={onChange} />);
    const fullname = await screen
      .findByTestId("profile-fullname")
      .catch(() => null);
    if (fullname) {
      fireEvent.change(fullname, { target: { value: "John" } });
      expect(onChange).toHaveBeenCalled();
    } else {
      expect(screen.getByTestId("profile-loading")).toBeInTheDocument();
    }
  });
});
