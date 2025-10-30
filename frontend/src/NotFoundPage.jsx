import React from "react";

export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50"
      data-testid="notfound-page"
    >
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        404: Page Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        The page you are looking for does not exist.
      </p>
      <a
        href="/dashboard"
        className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
      >
        Go to Dashboard
      </a>
    </div>
  );
}
