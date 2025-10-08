import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import axios from "axios";

export default function Step3Assets({ householdId, onNext }) {
  const [assets, setAssets] = useState([{ type: "", details: "" }]);

  const handleChange = (idx, field, value) => {
    const updated = [...assets];
    updated[idx][field] = value;
    setAssets(updated);
  };

  const addAsset = () => setAssets([...assets, { type: "", details: "" }]);

  const handleNext = async () => {
    for (const asset of assets) {
      await axios.post(
        `http://localhost:8000/api/v1/assets/?household_id=${householdId}`,
        {
          type: asset.type,
          details: { info: asset.details },
        }
      );
    }
    onNext();
  };

  return (
    <div>
      {assets.map((a, idx) => (
        <div key={idx}>
          <TextField
            label="Asset Type"
            value={a.type}
            onChange={(e) => handleChange(idx, "type", e.target.value)}
          />
          <TextField
            label="Details"
            value={a.details}
            onChange={(e) => handleChange(idx, "details", e.target.value)}
          />
        </div>
      ))}
      <Button onClick={addAsset}>Add Asset</Button>
      <Button onClick={handleNext}>Finish</Button>
    </div>
  );
}
