import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import OnboardingRoute from "../pages/OnboardingRoute";
import "@testing-library/jest-dom";

describe("OnboardingRoute", () => {
  it("renders onboarding stepper if not onboarded", () => {
    render(
      <MemoryRouter initialEntries={["/onboarding"]}>
        <Routes>
          <Route
            path="/onboarding"
            element={<OnboardingRoute isOnboarded={false} />}
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Onboarding/i)).toBeInTheDocument();
  });

  it("redirects to dashboard if onboarded", () => {
    render(
      <MemoryRouter initialEntries={["/onboarding"]}>
        <Routes>
          <Route
            path="/onboarding"
            element={<OnboardingRoute isOnboarded={true} />}
          />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );
    return screen.findByText(/Dashboard/i).then((el) => {
      expect(el).toBeInTheDocument();
    });
  });
});
