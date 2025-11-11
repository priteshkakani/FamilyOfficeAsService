import React from "react";

function ConfirmDialog({ open, title, message, onConfirm, onCancel, testid }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
      data-testid={testid}
    >
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <div className="mb-4 text-gray-700">{message}</div>
        <div className="flex gap-2 justify-end">
          <button className="px-4 py-2 rounded border" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white font-semibold"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
