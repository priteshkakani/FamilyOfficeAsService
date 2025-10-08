import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import axios from "axios";

export default function Step1Signup({ onNext }) {
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    await axios
      .post("http://localhost:8000/api/v1/users/signup", {
        mobile,
        name,
        email,
      })
      .then((res) => {
        setOtpSent(true);
        onNext(res.data.user_id);
      });
  };

  return (
    <div>
      <TextField
        label="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={handleSendOtp}>Send OTP</Button>
      {otpSent && <div>OTP sent! (Simulated)</div>}
    </div>
  );
}
