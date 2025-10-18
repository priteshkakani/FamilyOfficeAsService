import React from "react";

/**
 * OnboardingLayout - Centers content in a card with consistent spacing.
 * Supports an optional title prop and exposes a data-testid for tests.
 */
export default function OnboardingLayout({ children, title }) {
  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
      data-testid="onboarding-layout"
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6"
        role="main"
      >
        {title && (
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        )}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
