import React from "react";

export default function OnboardingLayout({ stepper, children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6 grid grid-cols-1 md:[grid-template-columns:260px_1fr] gap-6">
        {/* Left column: stepper (sticky on desktop) */}
        <div className="hidden md:block md:sticky md:top-6">{stepper}</div>

        {/* Right column: main content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
