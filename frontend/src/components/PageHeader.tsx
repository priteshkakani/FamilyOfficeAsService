import React from "react";

export default function PageHeader({ displayName, advisorName }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1
        className="text-2xl md:text-3xl font-semibold md:font-bold text-gray-900"
        data-testid="page-header-client-name"
      >
        {displayName || "Client Console"}
      </h1>
      {advisorName && (
        <span
          className="text-sm text-gray-500 font-normal ml-4"
          data-testid="page-header-advisor-name"
        >
          {advisorName}
        </span>
      )}
    </div>
  );
}
