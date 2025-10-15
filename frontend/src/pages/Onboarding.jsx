import React from "react";

export default function Onboarding({ onFinish }) {
  // ...other onboarding steps...
  return (
    <div>
      {/* ...other steps... */}
      <button
        type="button"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        data-testid="finish-onboarding"
        onClick={onFinish}
      >
        Complete Onboarding
      </button>
    </div>
  );
}
