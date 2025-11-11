import React from "react";

function ThreeDotsMenu({ actions, testid }) {
  // actions: [{ label, onClick, icon }]
  return (
    <div className="relative" data-testid={testid}>
      <button className="p-2 rounded hover:bg-gray-100" aria-label="Open menu">
        <span className="text-xl">⋮</span>
      </button>
      {/* Implement dropdown logic as needed */}
    </div>
  );
}

export default ThreeDotsMenu;
