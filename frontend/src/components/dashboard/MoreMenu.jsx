import React, { useState, useRef } from "react";

export default function MoreMenu({
  onView,
  onEdit,
  onUpload,
  onDelete,
  kpiKey,
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef();

  const handleContextMenu = (e) => {
    e.preventDefault();
    setOpen(true);
    setPos({ x: e.clientX, y: e.clientY });
  };
  const handleBlur = () => setOpen(false);
  return (
    <div
      className="relative"
      tabIndex={0}
      onBlur={handleBlur}
      onContextMenu={handleContextMenu}
    >
      <button
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="More"
        onClick={() => setOpen((v) => !v)}
        data-testid={`kpi-menu-${kpiKey}`}
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute z-50 bg-white border rounded shadow-lg py-2 w-40"
          style={{ left: pos.x, top: pos.y }}
          role="menu"
        >
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={onView}
            data-testid={`kpi-menu-details-${kpiKey}`}
          >
            View details
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={onUpload}
            data-testid={`drawer-upload-btn`}
          >
            Upload file
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
            onClick={onDelete}
            data-testid={`kpi-menu-delete-${kpiKey}`}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
