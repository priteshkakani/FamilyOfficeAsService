import React, { useState } from "react";

const RELATIONS = [
  "Father",
  "Mother",
  "Spouse",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
];

export default function FamilyStep({ data, onChange }) {
  const family = data.family_members || [];
  const [newMember, setNewMember] = useState({
    name: "",
    relation: RELATIONS[0],
  });

  const handleInput = (e) => {
    setNewMember({ ...newMember, [e.target.name]: e.target.value });
  };

  const addMember = () => {
    if (!newMember.name.trim()) return;
    onChange({
      ...data,
      family_members: [...family, { ...newMember }],
    });
    setNewMember({ name: "", relation: RELATIONS[0] });
  };

  const removeMember = (idx) => {
    onChange({ ...data, family_members: family.filter((_, i) => i !== idx) });
  };

  return (
    <div>
      <div className="mb-2 font-medium">Add your family members:</div>
      <div
        className="flex gap-2 items-center mb-4"
        data-testid="family-add-row"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newMember.name}
          onChange={handleInput}
          className="input input-bordered flex-1"
          data-testid="family-name-input"
        />
        <select
          name="relation"
          value={newMember.relation}
          onChange={handleInput}
          className="select select-bordered flex-1 rounded-lg focus:ring focus:ring-blue-200 transition"
          data-testid="family-relation-select"
        >
          {RELATIONS.map((rel) => (
            <option key={rel} value={rel}>
              {rel}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addMember}
          className="btn btn-primary rounded-lg px-6 py-2 font-semibold shadow focus:ring focus:ring-blue-200"
          data-testid="family-add-btn"
        >
          Add
        </button>
      </div>
      <div className="space-y-4">
        {family.map((member, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row gap-4 items-center border border-gray-100 bg-gray-50 rounded-lg p-3"
            data-testid={`family-member-row-${idx}`}
          >
            <span
              className="flex-1 text-gray-700 font-medium"
              data-testid="family-member-name"
            >
              {member.name}
            </span>
            <span
              className="flex-1 text-gray-600"
              data-testid="family-member-relation"
            >
              {member.relation}
            </span>
            <button
              type="button"
              onClick={() => removeMember(idx)}
              className="btn btn-error btn-sm rounded-lg focus:ring focus:ring-blue-200"
              data-testid={`family-remove-btn-${idx}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
