import React from "react";

export default function OnboardingLayout({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 space-y-5"
        role="main"
        data-testid="onboarding-layout"
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
