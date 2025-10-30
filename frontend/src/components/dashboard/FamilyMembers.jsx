import React from "react";

export default function FamilyMembers({ members = [], userId, onDelete }) {
  return (
    <div className="space-y-3">
      {members.length === 0 && (
        <div className="text-gray-500">No family members added.</div>
      )}
      {members.map((m) => (
        <div
          key={m.id}
          className="flex items-center justify-between bg-white rounded shadow p-3"
        >
          <div>
            <div className="font-semibold">{m.name}</div>
            <div className="text-xs text-gray-500">{m.relationship}</div>
          </div>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            onClick={() => onDelete(m.id)}
            data-testid={`delete-family-member-${m.id}`}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
