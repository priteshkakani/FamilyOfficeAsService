import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import axios from "axios";

export default function Step2Family({ userId, onNext }) {
  const [name, setName] = useState("");
  const [members, setMembers] = useState([
    { name: "", dob: "", relationship: "", role: "" },
  ]);

  const handleChange = (idx, field, value) => {
    const updated = [...members];
    updated[idx][field] = value;
    setMembers(updated);
  };

  const addMember = () =>
    setMembers([...members, { name: "", dob: "", relationship: "", role: "" }]);

  const handleNext = async () => {
    await axios
      .post(`http://localhost:8000/api/v1/households/?owner_id=${userId}`, {
        name,
        members,
      })
      .then((res) => {
        onNext(res.data.household_id);
      });
  };

  return (
    <div>
      <TextField
        label="Household Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {members.map((m, idx) => (
        <div key={idx}>
          <TextField
            label="Name"
            value={m.name}
            onChange={(e) => handleChange(idx, "name", e.target.value)}
          />
          <TextField
            label="DOB"
            type="date"
            value={m.dob}
            onChange={(e) => handleChange(idx, "dob", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Relationship"
            value={m.relationship}
            onChange={(e) => handleChange(idx, "relationship", e.target.value)}
          />
          <TextField
            label="Role"
            value={m.role}
            onChange={(e) => handleChange(idx, "role", e.target.value)}
          />
        </div>
      ))}
      <Button onClick={addMember}>Add Member</Button>
      <Button onClick={handleNext}>Next</Button>
    </div>
  );
}
