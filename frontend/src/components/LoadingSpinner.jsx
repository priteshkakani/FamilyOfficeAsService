import React from "react";

export default function LoadingSpinner({ size = 8, text = "Loading..." }) {
  const s = `h-${size} w-${size}`;
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-2">
      <svg
        className={`animate-spin ${s} text-blue-600`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      {text && <div className="text-sm text-gray-600">{text}</div>}
    </div>
  );
}
