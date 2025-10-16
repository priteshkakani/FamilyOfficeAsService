import React from "react";

/**
 * OnboardingLayout - Centers content in a card with consistent spacing.
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export default function OnboardingLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        {children}
      </div>
    </div>
  );
}
