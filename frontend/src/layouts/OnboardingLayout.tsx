import React from "react";

/**
 * Clean OnboardingLayout used for single-step centered pages.
 * Keeps a consistent card look for all onboarding steps.
 */
export default function OnboardingLayout({ children, title }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
      data-testid="onboarding-layout"
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 space-y-5"
        role="main"
      >
        {title ? (
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            {title}
          </h2>
        ) : null}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
