// Centralized navigation after onboarding saves
// Usage: import { navigateToDashboardAfterAllSaves } from './onboardingNavigation';
// Call navigateToDashboardAfterAllSaves() after all onboarding saves and invalidations are complete.
import { useNavigate } from "react-router-dom";

export function navigateToDashboardAfterAllSaves(navigate) {
  // Defensive: allow passing navigate or using useNavigate
  const nav = navigate || useNavigate();
  // Add a small delay to ensure all queries are invalidated and UI is ready
  setTimeout(() => {
    nav("/dashboard");
  }, 300);
}
