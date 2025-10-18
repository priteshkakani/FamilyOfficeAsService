import React from "react";

export default function SettingsModal({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black/30 absolute inset-0" onClick={onClose} />
      <div className="bg-white rounded-xl shadow p-6 z-10 w-[640px]">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Settings</h3>
          <button onClick={onClose} aria-label="close">
            Close
          </button>
        </div>
        <div className="mt-4">Profile & product preferences (placeholder)</div>
      </div>
    </div>
  );
}
