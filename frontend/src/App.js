// Investment Advice Details Page
function InvestmentAdvicePage() {
  const smallcases = [
    { name: "Top Tech Innovators", desc: "Diversified tech sector smallcase." },
    {
      name: "Green Energy Leaders",
      desc: "Focus on renewable energy companies.",
    },
    { name: "India Rising", desc: "Growth-oriented Indian equities." },
  ];
  const mutualFunds = [
    { name: "HDFC Flexi Cap Fund", desc: "Large & mid cap equity fund." },
    { name: "Mirae Asset Large Cap", desc: "Consistent large cap performer." },
    { name: "Parag Parikh Flexi Cap", desc: "Diversified, value-driven fund." },
  ];
  const stocks = [
    { name: "Reliance Industries", desc: "Conglomerate, energy & retail." },
    { name: "Tata Consultancy Services", desc: "IT services leader." },
    { name: "HDFC Bank", desc: "Top private sector bank." },
  ];
  const realEstate = [
    { name: "Prestige Shantiniketan", desc: "Bangalore residential project." },
    { name: "DLF Cyber City", desc: "Commercial real estate, Gurgaon." },
    { name: "Godrej Garden City", desc: "Ahmedabad township." },
  ];
  return (
    <Box sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Investment Advice
      </Typography>
      <Box>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Smallcases
        </Typography>
        <ul>
          {smallcases.map((s) => (
            <li key={s.name}>
              <b>{s.name}</b>: {s.desc}
            </li>
          ))}
        </ul>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Mutual Funds
        </Typography>
        <ul>
          {mutualFunds.map((m) => (
            <li key={m.name}>
              <b>{m.name}</b>: {m.desc}
            </li>
          ))}
        </ul>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Stocks
        </Typography>
        <ul>
          {stocks.map((s) => (
            <li key={s.name}>
              <b>{s.name}</b>: {s.desc}
            </li>
          ))}
        </ul>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Real Estate
        </Typography>
        <ul>
          {realEstate.map((r) => (
            <li key={r.name}>
              <b>{r.name}</b>: {r.desc}
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  );
}

// Minimal ConnectAccounts component (placeholder)
function ConnectAccounts() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f7f8fa",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          p: 4,
          borderRadius: 2,
          boxShadow: 2,
          bgcolor: "#fff",
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Connect Your Accounts
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Account connection functionality coming soon.
        </Typography>
      </Box>
    </Box>
  );
}
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Divider,
  LinearProgress,
  Modal,
  TextField,
  MenuItem,
} from "@mui/material";
// NotFoundPage for unmatched routes
function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#fffbe9",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          p: 4,
          borderRadius: 2,
          boxShadow: 2,
          bgcolor: "#fff",
        }}
      >
        <Typography variant="h3" color="error" gutterBottom>
          404: Page Not Found
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          The page you are looking for does not exist.
          <br />
          If you are a developer, check your router configuration and
          Netlify/Vercel _redirects settings for client-side routing support.
        </Typography>
      </Box>
      {/* Security Assurance */}
      <Box
        sx={{
          maxWidth: 700,
          mx: "auto",
          bgcolor: "#e3f2fd",
          p: 3,
          borderRadius: 2,
          boxShadow: 0,
          textAlign: "center",
          mb: 8,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Security Assurance
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          DPDP-compliant, 256-bit encryption, SEBI registered (if applicable).
        </Typography>
      </Box>
      {/* Floating Login/Signup CTA */}
      <Button
        variant="contained"
        color="secondary"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          px: 4,
          py: 1.5,
          fontWeight: 700,
          fontSize: 18,
          borderRadius: 2,
          boxShadow: 3,
          zIndex: 2000,
        }}
        onClick={() => navigate("/login")}
      >
        Login / Signup
      </Button>
    </Box>
  );
}
// ...existing code...

import { useRef } from "react";
function SignupLogin() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode") || "signin";
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailInput = useRef();

  useEffect(() => {
    const token = localStorage.getItem("foas_token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      // Call backend to send magic link
      const res = await fetch("/api/v1/users/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Check your email for the login link.");
      } else {
        setError(data.error || "Failed to send magic link");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f7f8fa",
      }}
    >
      <Box
        sx={{
          width: 340,
          bgcolor: "#fff",
          p: 4,
          borderRadius: 3,
          boxShadow: 2,
        }}
      >
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {mode === "signup" ? "Sign Up" : "Sign In"}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Enter your email to{" "}
          {mode === "signup" ? "create an account" : "sign in"}.
        </Typography>
        <form onSubmit={handleEmailSignIn}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            ref={emailInput}
            required
            style={{
              width: "100%",
              padding: 12,
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid #ccc",
              marginBottom: 16,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ fontWeight: 700, mb: 2 }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </Button>
        </form>
        <Divider sx={{ my: 2 }}>or</Divider>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{
            fontWeight: 700,
            bgcolor: "#fff",
            color: "#222",
            border: "1px solid #eee",
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
          startIcon={
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              style={{ width: 24, height: 24 }}
            />
          }
          onClick={() => (window.location.href = "/api/v1/users/google-login")}
        >
          Sign in with Google
        </Button>
        <Divider sx={{ my: 2 }}>or</Divider>
        <Button
          variant="outlined"
          color="success"
          fullWidth
          sx={{ fontWeight: 700, mb: 1 }}
          onClick={() => navigate("/dashboard")}
        >
          Continue without login (Demo)
        </Button>
        <Button
          variant="outlined"
          color="info"
          fullWidth
          sx={{ fontWeight: 700, mb: 1 }}
          onClick={() => navigate("/onboarding")}
        >
          Try Onboarding Wizard (Demo)
        </Button>
        {message && (
          <Typography color="primary" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

const dashboardTabs = [
  { icon: "🏠", label: "Dashboard" },
  { icon: "💰", label: "Assets" },
  { icon: "📉", label: "Liabilities" },
  { icon: "📊", label: "Net Worth" },
  { icon: "🧾", label: "Cashflow & Expenses" },
  { icon: "📁", label: "Documents" },
  { icon: "󰰁", label: "Family Members" },
  { icon: "📅", label: "Insights & Alerts" },
  { icon: "󰞴", label: "Advisor / Chat" },
  { icon: "⚙️", label: "Settings / Billing" },
];

const defaultAssets = [
  { type: "Bank Account", value: 100000 },
  { type: "Mutual Funds", value: 200000 },
  { type: "Stocks", value: 150000 },
  { type: "Real Estate", value: 500000 },
  { type: "Gold", value: 50000 },
];
const defaultLiabilities = [
  { type: "Home Loan", value: 200000 },
  { type: "Car Loan", value: 50000 },
];
const defaultIncome = [
  { source: "Salary", value: 100000 },
  { source: "Business", value: 20000 },
];
const defaultExpenses = [
  { category: "EMI", value: 15000 },
  { category: "Groceries", value: 8000 },
  { category: "Utilities", value: 4000 },
];
const defaultFamily = [
  { name: "Amit", age: 45, role: "Primary", assets: "₹1.2Cr" },
  { name: "Priya", age: 42, role: "Spouse", assets: "₹80L" },
];
const investmentAdvice = [
  { type: "Smallcases", advice: "Diversify with top smallcases for 2025." },
  { type: "Mutual Funds", advice: "Increase SIP in large-cap funds." },
  { type: "Stocks", advice: "Review direct equity for rebalancing." },
  { type: "Real Estate", advice: "Consider REITs for liquidity." },
];

const OnboardingWizard = () => {
  const navigate = useNavigate();
  // Step 1: Family Profile
  const [familyName, setFamilyName] = useState("");
  const [primaryContact, setPrimaryContact] = useState("");
  const [members, setMembers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    relation: "Self",
    dob: "",
    role: "Decision Maker",
  });

  const addMember = () => {
    setMembers([...members, newMember]);
    setNewMember({
      name: "",
      relation: "Self",
      dob: "",
      role: "Decision Maker",
    });
    setModalOpen(false);
  };

  // Add step state
  const [step, setStep] = useState(1);
  const [taxITR, setTaxITR] = useState({ pan: "", year: "" });
  const [epfo, setEPFO] = useState({ uan: "", mobile: "", otp: "" });
  const [epfoOtpSent, setEpfoOtpSent] = useState(false);

  // Ensure correct step order: 1=Family, 2=Insurance, 3=Tax, 4=EPFO, 5=Physical Assets
  const nextStep = () => {
    // Reset EPFO OTP state when entering EPFO step
    if (step === 3) setEpfoOtpSent(false);
    setStep((s) => s + 1);
  };
  const prevStep = () => setStep((s) => (s > 1 ? s - 1 : 1));

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      {step === 1 && (
        <>
          <Typography variant="h6">Step 1: Family Profile</Typography>
          <LinearProgress
            variant="determinate"
            value={10}
            style={{ margin: "16px 0" }}
          />
          <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Add Family Member
            </Typography>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={newMember.name}
              onChange={(e) =>
                setNewMember({ ...newMember, name: e.target.value })
              }
            />
            <TextField
              label="Relation"
              select
              fullWidth
              margin="normal"
              value={newMember.relation}
              onChange={(e) =>
                setNewMember({ ...newMember, relation: e.target.value })
              }
            >
              {[
                "Self",
                "Spouse",
                "Mother",
                "Father",
                "Kid 1",
                "Kid 2",
                "Additional",
              ].map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="PAN Number"
              fullWidth
              margin="normal"
              value={newMember.pan || ""}
              onChange={(e) =>
                setNewMember({ ...newMember, pan: e.target.value })
              }
            />
            <Button
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={addMember}
              disabled={
                !newMember.name || !newMember.relation || !newMember.pan
              }
            >
              Add Member
            </Button>
          </Box>
          {members.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Family Members:</Typography>
              <ul>
                {members.map((m, idx) => (
                  <li key={idx}>
                    {m.name} ({m.relation}) - PAN: {m.pan}
                  </li>
                ))}
              </ul>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={nextStep}
            sx={{ mt: 2 }}
            disabled={members.length === 0}
          >
            Next
          </Button>
        </>
      )}
      {step === 2 && (
        <>
          <Typography variant="h6">
            Track your insurance and renewal dates easily.
          </Typography>
          <LinearProgress
            variant="determinate"
            value={30}
            style={{ margin: "16px 0" }}
          />
          {/* Insurance form placeholder */}
          <Button variant="outlined" onClick={prevStep} sx={{ mt: 2, mr: 2 }}>
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={nextStep}
            sx={{ mt: 2 }}
          >
            Next
          </Button>
        </>
      )}
      {step === 3 && (
        <>
          <Typography variant="h6">Add Tax Details</Typography>
          <LinearProgress
            variant="determinate"
            value={50}
            style={{ margin: "16px 0" }}
          />
          <TextField
            label="PAN"
            fullWidth
            margin="normal"
            value={taxITR.pan}
            onChange={(e) => setTaxITR({ ...taxITR, pan: e.target.value })}
          />
          <TextField
            label="Assessment Year"
            fullWidth
            margin="normal"
            value={taxITR.year}
            onChange={(e) => setTaxITR({ ...taxITR, year: e.target.value })}
          />
          <Button variant="outlined" onClick={prevStep} sx={{ mt: 2, mr: 2 }}>
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={nextStep}
            sx={{ mt: 2 }}
          >
            Next
          </Button>
        </>
      )}
      {step === 4 && (
        <>
          <Typography variant="h6">Add EPFO Details</Typography>
          <LinearProgress
            variant="determinate"
            value={70}
            style={{ margin: "16px 0" }}
          />
          <TextField
            label="UAN"
            fullWidth
            margin="normal"
            value={epfo.uan}
            onChange={(e) => setEPFO({ ...epfo, uan: e.target.value })}
          />
          <TextField
            label="Mobile Number"
            fullWidth
            margin="normal"
            value={epfo.mobile}
            onChange={(e) => setEPFO({ ...epfo, mobile: e.target.value })}
          />
          {!epfoOtpSent ? (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => setEpfoOtpSent(true)}
            >
              Send OTP
            </Button>
          ) : (
            <>
              <TextField
                label="Enter OTP"
                fullWidth
                margin="normal"
                value={epfo.otp}
                onChange={(e) => setEPFO({ ...epfo, otp: e.target.value })}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={nextStep}
              >
                Next
              </Button>
            </>
          )}
          <Button variant="outlined" onClick={prevStep} sx={{ mt: 2, ml: 2 }}>
            Back
          </Button>
        </>
      )}
      {step === 5 && (
        <>
          <Typography variant="h6">Record your physical assets</Typography>
          <LinearProgress
            variant="determinate"
            value={90}
            style={{ margin: "16px 0" }}
          />
          {/* Physical assets form placeholder */}
          <Button variant="outlined" onClick={prevStep} sx={{ mt: 2, mr: 2 }}>
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={nextStep}
          >
            Next
          </Button>
        </>
      )}
      {step > 5 && (
        <Typography variant="h5" sx={{ mt: 4 }}>
          Onboarding Complete!
        </Typography>
      )}
    </div>
  );
};
const AddMutualFunds = () => {
  const [manual, setManual] = useState(false);
  const [scheme, setScheme] = useState("");
  const [folio, setFolio] = useState("");
  const [value, setValue] = useState("");
  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <Typography variant="h6">Let’s get your investment data.</Typography>
      <LinearProgress
        variant="determinate"
        value={30}
        style={{ margin: "16px 0" }}
      />
      <div style={{ margin: "24px 0" }}>
        <Button
          variant={!manual ? "contained" : "outlined"}
          onClick={() => setManual(false)}
        >
          <img
            src="https://www.camsrepository.com/images/cams-logo.png"
            alt="CAMS"
            height={24}
            style={{ verticalAlign: "middle", marginRight: 8 }}
          />
          Authorize CAMS Access
        </Button>
        <Button
          variant={!manual ? "contained" : "outlined"}
          onClick={() => setManual(false)}
          style={{ marginLeft: 8 }}
        >
          <img
            src="https://www.kfintech.com/wp-content/themes/kfintech/images/logo.png"
            alt="KFin"
            height={24}
            style={{ verticalAlign: "middle", marginRight: 8 }}
          />
          Authorize KFin Access
        </Button>
        <Button
          variant={manual ? "contained" : "outlined"}
          onClick={() => setManual(true)}
          style={{ marginLeft: 8 }}
        >
          Enter Manually
        </Button>
      </div>
      {manual && (
        <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
          <TextField
            label="Scheme Name"
            fullWidth
            margin="normal"
            value={scheme}
            onChange={(e) => setScheme(e.target.value)}
          />
          <TextField
            label="Folio No"
            fullWidth
            margin="normal"
            value={folio}
            onChange={(e) => setFolio(e.target.value)}
          />
          <TextField
            label="Investment Value"
            fullWidth
            margin="normal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Box>
      )}
      <Button variant="contained" color="primary" style={{ marginTop: 16 }}>
        Next →
      </Button>
    </div>
  );
};

const AddInsurance = () => {
  const [tab, setTab] = useState("Health");
  const [policies, setPolicies] = useState([]);
  const [insuranceModalOpen, setInsuranceModalOpen] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    insurer: "",
    type: "Health",
    number: "",
    sum: "",
    start: "",
    end: "",
  });
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <Typography variant="h6">
        Track your insurance and renewal dates easily.
      </Typography>
      <LinearProgress
        variant="determinate"
        value={40}
        style={{ margin: "16px 0" }}
      />
      <div style={{ margin: "16px 0" }}>
        {["Health", "Motor", "Life"].map((t) => (
          <Button
            key={t}
            variant={tab === t ? "contained" : "outlined"}
            onClick={() => setTab(t)}
            style={{ marginRight: 8 }}
          >
            {t}
          </Button>
        ))}
      </div>
      <div style={{ margin: "16px 0" }}>
        <Button variant="outlined" onClick={() => setInsuranceModalOpen(true)}>
          + Add Policy
        </Button>
        {policies.map((p, idx) => (
          <div key={idx} style={{ marginTop: 8 }}>
            {p.insurer} ({p.type}) - {p.number} - {p.sum} - {p.start} to {p.end}
          </div>
        ))}
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/onboarding?step=tax")}
      >
        Next →
      </Button>
      <Modal
        open={insuranceModalOpen}
        onClose={() => setInsuranceModalOpen(false)}
      >
        <Box
          sx={{
            p: 4,
            bgcolor: "background.paper",
            maxWidth: 400,
            mx: "auto",
            mt: 10,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Add Policy</Typography>
          <TextField
            label="Insurer Name"
            fullWidth
            margin="normal"
            value={newPolicy.insurer}
            onChange={(e) =>
              setNewPolicy({ ...newPolicy, insurer: e.target.value })
            }
          />
          <TextField
            label="Policy Type"
            select
            fullWidth
            margin="normal"
            value={newPolicy.type}
            onChange={(e) =>
              setNewPolicy({ ...newPolicy, type: e.target.value })
            }
          >
            {["Health", "Motor", "Life"].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Policy Number"
            fullWidth
            margin="normal"
            value={newPolicy.number}
            onChange={(e) =>
              setNewPolicy({ ...newPolicy, number: e.target.value })
            }
          />
          <TextField
            label="Sum Assured"
            fullWidth
            margin="normal"
            value={newPolicy.sum}
            onChange={(e) =>
              setNewPolicy({ ...newPolicy, sum: e.target.value })
            }
          />
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newPolicy.start}
            onChange={(e) =>
              setNewPolicy({ ...newPolicy, start: e.target.value })
            }
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newPolicy.end}
            onChange={(e) =>
              setNewPolicy({ ...newPolicy, end: e.target.value })
            }
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setPolicies([...policies, newPolicy]);
              setInsuranceModalOpen(false);
              setNewPolicy({
                insurer: "",
                type: "Health",
                number: "",
                sum: "",
                start: "",
                end: "",
              });
            }}
            style={{ marginTop: 16 }}
          >
            Add
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

const AddLiabilities = () => {
  const [loans, setLoans] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newLoan, setNewLoan] = useState({
    type: "Home",
    bank: "",
    balance: "",
    emi: "",
    end: "",
  });
  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <Typography variant="h6">
        Let’s include your loans and credit obligations.
      </Typography>
      <LinearProgress
        variant="determinate"
        value={60}
        style={{ margin: "16px 0" }}
      />
      <div style={{ margin: "16px 0" }}>
        <Button variant="outlined" onClick={() => setModalOpen(true)}>
          + Add Loan
        </Button>
        {loans.map((l, idx) => (
          <div key={idx} style={{ marginTop: 8 }}>
            {l.type} - {l.bank} - {l.balance} - {l.emi} - {l.end}
          </div>
        ))}
      </div>
      <Button variant="contained" color="primary">
        Next →
      </Button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            p: 4,
            bgcolor: "background.paper",
            maxWidth: 400,
            mx: "auto",
            mt: 10,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Add Loan</Typography>
          <TextField
            label="Loan Type"
            select
            fullWidth
            margin="normal"
            value={newLoan.type}
            onChange={(e) => setNewLoan({ ...newLoan, type: e.target.value })}
          >
            {["Home", "Car", "Personal", "Credit Card"].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Bank / Lender"
            fullWidth
            margin="normal"
            value={newLoan.bank}
            onChange={(e) => setNewLoan({ ...newLoan, bank: e.target.value })}
          />
          <TextField
            label="Outstanding Balance"
            fullWidth
            margin="normal"
            value={newLoan.balance}
            onChange={(e) =>
              setNewLoan({ ...newLoan, balance: e.target.value })
            }
          />
          <TextField
            label="EMI per month"
            fullWidth
            margin="normal"
            value={newLoan.emi}
            onChange={(e) => setNewLoan({ ...newLoan, emi: e.target.value })}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newLoan.end}
            onChange={(e) => setNewLoan({ ...newLoan, end: e.target.value })}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setLoans([...loans, newLoan]);
              setModalOpen(false);
              setNewLoan({
                type: "Home",
                bank: "",
                balance: "",
                emi: "",
                end: "",
              });
            }}
            style={{ marginTop: 16 }}
          >
            Add
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

const IncomeExpenses = () => {
  const [income, setIncome] = useState({
    Salary: "",
    Business: "",
    Rent: "",
    Dividends: "",
    Others: "",
  });
  const [expenses, setExpenses] = useState({
    EMIs: "",
    Insurance: "",
    Utilities: "",
    Groceries: "",
    School: "",
    Others: "",
  });
  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <Typography variant="h6">Help us map your monthly cash flow.</Typography>
      <LinearProgress
        variant="determinate"
        value={70}
        style={{ margin: "16px 0" }}
      />
      <Typography variant="subtitle1">Income Sources</Typography>
      {Object.keys(income).map((key) => (
        <TextField
          key={key}
          label={key}
          fullWidth
          margin="normal"
          value={income[key]}
          onChange={(e) => setIncome({ ...income, [key]: e.target.value })}
        />
      ))}
      <Typography variant="subtitle1" style={{ marginTop: 16 }}>
        Monthly Expenses
      </Typography>
      {Object.keys(expenses).map((key) => (
        <TextField
          key={key}
          label={key}
          fullWidth
          margin="normal"
          value={expenses[key]}
          onChange={(e) => setExpenses({ ...expenses, [key]: e.target.value })}
        />
      ))}
      <Button variant="contained" color="primary" style={{ marginTop: 16 }}>
        Next →
      </Button>
    </div>
  );
};

const SetupComplete = () => {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
      <LinearProgress
        variant="determinate"
        value={100}
        style={{ margin: "16px 0" }}
      />
      <Typography variant="h5" style={{ margin: "32px 0" }}>
        Your Family Office is ready.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate("/dashboard")}
      >
        View Dashboard →
      </Button>
    </div>
  );
};
import axios from "axios";
const MainDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adviceOpen, setAdviceOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [cashflows, setCashflows] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  // For demo, household_id is 1. In production, get from user context/session.
  const household_id = 1;

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [
          assetsRes,
          liabilitiesRes,
          cashflowsRes,
          familyRes,
          expensesRes,
        ] = await Promise.all([
          axios.get(
            `/api/v1/assets/supabase/assets?household_id=${household_id}`
          ),
          axios.get(
            `/api/v1/assets/supabase/liabilities?household_id=${household_id}`
          ),
          axios.get(
            `/api/v1/assets/supabase/cashflows?household_id=${household_id}`
          ),
          axios.get(
            `/api/v1/assets/supabase/family?household_id=${household_id}`
          ),
          axios.get(
            `/api/v1/assets/supabase/expenses?household_id=${household_id}`
          ),
        ]);
        setAssets(assetsRes.data.assets || []);
        setLiabilities(liabilitiesRes.data.liabilities || []);
        setCashflows(cashflowsRes.data.cashflows || []);
        setFamilyMembers(familyRes.data.family_members || []);
        setExpenses(expensesRes.data.expenses || []);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Calculations
  const totalAssets = assets.reduce((sum, a) => sum + (a.value || 0), 0);
  const totalLiabilities = liabilities.reduce(
    (sum, l) => sum + (l.value || 0),
    0
  );
  const totalNetWorth = totalAssets + totalLiabilities;
  const monthlyIncome = familyMembers.reduce(
    (sum, m) => sum + (m.income || 0),
    0
  );
  const monthlySavings = 30000; // Placeholder
  const monthlyCashflow =
    monthlyIncome -
    liabilities.reduce((sum, l) => sum + (l.value || 0) / 12, 0);
  const investmentAdvice = [
    { type: "Smallcases", advice: "Diversify with top smallcases for 2025." },
    { type: "Mutual Funds", advice: "Increase SIP in large-cap funds." },
    { type: "Stocks", advice: "Review direct equity for rebalancing." },
    { type: "Real Estate", advice: "Consider REITs for liquidity." },
  ];
  const summary = [
    { label: "Total Net Worth", value: `₹${totalNetWorth}` },
    { label: "Total Assets", value: `₹${totalAssets}` },
    { label: "Total Liabilities", value: `₹${totalLiabilities}` },
    { label: "Monthly Income", value: `₹${monthlyIncome}` },
    { label: "Monthly Savings", value: `₹${monthlySavings}` },
    { label: "Monthly Cashflow", value: `₹${monthlyCashflow}` },
    {
      label: "Investment Advice",
      value: (
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setAdviceOpen(true)}
        >
          View Advice
        </Button>
      ),
    },
  ];

  if (loading) return <Box sx={{ p: 4 }}>Loading dashboard...</Box>;
  if (error) return <Box sx={{ p: 4, color: "red" }}>{error}</Box>;

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f7f8fa" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 220,
          bgcolor: "#fff",
          borderRight: "1px solid #eee",
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Family Office
        </Typography>
        {[
          ["🏠", "Dashboard", ""],
          ["💰", "Assets", "assets"],
          ["📉", "Liabilities", "liabilities"],
          ["📊", "Net Worth", "net-worth"],
          ["🧾", "Cashflow & Expenses", "cashflow"],
          ["📁", "Documents", "documents"],
          ["📄", "Tax-ITR", "tax-itr"],
          ["💼", "EPFO", "epfo"],
          ["󰰁", "Family Members", "family"],
          ["💡", "Investment Advice", "investment-advice", true],
          ["📅", "Insights & Alerts", "insights"],
          ["󰞴", "Advisor / Chat", "advisor"],
          ["⚙️", "Settings / Billing", "settings"],
        ].map(([icon, label, subpath, highlight]) => (
          <Button
            key={label}
            fullWidth
            sx={{
              justifyContent: "flex-start",
              mb: 1,
              bgcolor: highlight ? "#e3f2fd" : undefined,
              color: highlight ? "#1976d2" : undefined,
              fontWeight: highlight ? 700 : 400,
              borderLeft: highlight ? "4px solid #1976d2" : undefined,
              boxShadow: highlight ? 2 : undefined,
            }}
            startIcon={<span>{icon}</span>}
            onClick={() => navigate(`/dashboard/${subpath}`)}
          >
            {label}
          </Button>
        ))}
      </Box>
      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Dashboard Routing (nested) */}
        <Routes>
          <Route
            path="/"
            element={
              <DashboardHome
                summary={summary}
                adviceOpen={adviceOpen}
                setAdviceOpen={setAdviceOpen}
                investmentAdvice={investmentAdvice}
                familyMembers={familyMembers}
                assets={assets}
                liabilities={liabilities}
                cashflows={cashflows}
                expenses={expenses}
              />
            }
          />
          <Route path="assets" element={<AssetsPage assets={assets} />} />
          <Route
            path="liabilities"
            element={<LiabilitiesPage liabilities={liabilities} />}
          />
          <Route
            path="net-worth"
            element={<NetWorthPage assets={assets} liabilities={liabilities} />}
          />
          <Route
            path="cashflow"
            element={<CashflowPage cashflows={cashflows} expenses={expenses} />}
          />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="tax-itr" element={<TaxITRPage />} />
          <Route path="epfo" element={<EPFOPage />} />
          <Route
            path="family"
            element={<FamilyPage familyMembers={familyMembers} />}
          />
          <Route path="investment-advice" element={<InvestmentAdvicePage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="advisor" element={<AdvisorPage />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* Default route for unmatched dashboard subroutes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

// Placeholder Tax-ITR and EPFO dashboard pages
function TaxITRPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Tax-ITR Documents</Typography>
      <Typography color="text.secondary">
        Uploaded and fetched ITR documents will appear here.
      </Typography>
    </Box>
  );
}
function EPFOPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">EPFO Documents</Typography>
      <Typography color="text.secondary">
        Uploaded and fetched EPFO documents will appear here.
      </Typography>
    </Box>
  );
}

// Simple pages for each tab (move outside MainDashboard)
// Dashboard Home Page

function DashboardHome({
  summary,
  adviceOpen,
  setAdviceOpen,
  investmentAdvice,
  familyMembers,
  assets,
  liabilities,
  cashflows,
  expenses,
}) {
  // For now, keep net worth trend and asset allocation as static demo data
  const netWorthTrend = [
    { month: "Jan", value: 1000000 },
    { month: "Feb", value: 1100000 },
    { month: "Mar", value: 1200000 },
    { month: "Apr", value: 1300000 },
    { month: "May", value: 1400000 },
  ];
  const assetAllocation = [
    { type: "Bank Account", value: 40 },
    { type: "Mutual Funds", value: 30 },
    { type: "Stocks", value: 20 },
    { type: "Real Estate", value: 10 },
  ];
  return (
    <Box sx={{ display: "flex", flex: 1, overflow: "auto" }}>
      {/* Main Section */}
      <Box sx={{ flex: 2, p: 3 }}>
        {/* Summary Cards */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          {summary.map((card) => (
            <Box
              key={card.label}
              sx={{
                flex: "1 1 220px",
                bgcolor: "#fff",
                p: 2,
                borderRadius: 2,
                boxShadow: 1,
                textAlign: "center",
                minWidth: 180,
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                {card.label}
              </Typography>
              <Typography variant="h6">{card.value}</Typography>
            </Box>
          ))}
        </Box>
        {/* Investment Advice Modal */}
        <Modal open={adviceOpen} onClose={() => setAdviceOpen(false)}>
          <Box
            sx={{
              p: 4,
              bgcolor: "background.paper",
              maxWidth: 400,
              mx: "auto",
              mt: 10,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Investment Advice
            </Typography>
            {investmentAdvice.map((item) => (
              <Box key={item.type} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{item.type}</Typography>
                <Typography color="text.secondary">{item.advice}</Typography>
              </Box>
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={() => setAdviceOpen(false)}
              fullWidth
            >
              Close
            </Button>
          </Box>
        </Modal>
        {/* Charts */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Box
            sx={{
              flex: 2,
              bgcolor: "#fff",
              p: 2,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography variant="subtitle1">Net Worth Trend</Typography>
            <Box
              sx={{
                height: 180,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                mt: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Simple SVG line chart */}
              <svg width="100%" height="100%" viewBox="0 0 300 120">
                <polyline
                  fill="none"
                  stroke="#1976d2"
                  strokeWidth="3"
                  points="0,100 60,80 120,60 180,40 240,20 300,10"
                />
                <circle cx="0" cy="100" r="3" fill="#1976d2" />
                <circle cx="60" cy="80" r="3" fill="#1976d2" />
                <circle cx="120" cy="60" r="3" fill="#1976d2" />
                <circle cx="180" cy="40" r="3" fill="#1976d2" />
                <circle cx="240" cy="20" r="3" fill="#1976d2" />
                <circle cx="300" cy="10" r="3" fill="#1976d2" />
              </svg>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              bgcolor: "#fff",
              p: 2,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography variant="subtitle1">Asset Allocation</Typography>
            <Box
              sx={{
                height: 180,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                mt: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Simple SVG bar chart */}
              <svg width="100%" height="100%" viewBox="0 0 120 120">
                <rect x="10" y="60" width="15" height="50" fill="#1976d2" />
                <rect x="35" y="40" width="15" height="70" fill="#388e3c" />
                <rect x="60" y="80" width="15" height="30" fill="#fbc02d" />
                <rect x="85" y="90" width="15" height="20" fill="#d32f2f" />
              </svg>
            </Box>
          </Box>
        </Box>
        {/* Recent Transactions Table */}
        <Box
          sx={{ bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 1, mb: 3 }}
        >
          <Typography variant="subtitle1">Recent Transactions</Typography>
          <Box sx={{ mt: 1 }}>
            <Typography color="text.secondary">[Table Placeholder]</Typography>
          </Box>
        </Box>
        {/* Alerts & Renewals */}
        <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1">Alerts & Renewals</Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>LIC policy renewal in 15 days</li>
            <li>ESOP vesting due next month</li>
          </ul>
        </Box>
      </Box>
      {/* Right Panel */}
      <Box sx={{ flex: 1, p: 3, minWidth: 280 }}>
        <Box
          sx={{ bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 1, mb: 3 }}
        >
          <Typography variant="subtitle1">Family Members</Typography>
          {familyMembers.length === 0 ? (
            <Typography color="text.secondary">
              No family members found.
            </Typography>
          ) : (
            familyMembers.map((m) => (
              <Box
                key={m.name}
                sx={{ display: "flex", alignItems: "center", mt: 2 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#e0e0e0",
                    borderRadius: "50%",
                    mr: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography>{m.name ? m.name[0] : "?"}</Typography>
                </Box>
                <Box>
                  <Typography>
                    {m.name} {m.age ? `(${m.age})` : ""}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {m.role} {m.assets ? `| ${m.assets}` : ""}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
        <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1">Advisor Notes</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            [Reminders/Notes Placeholder]
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// Simple pages for each tab
function AssetsPage({ assets = [] }) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Assets</Typography>
      <ul>
        {assets.map((a, i) => (
          <li key={i}>
            {a.type}: ₹{a.value}
          </li>
        ))}
      </ul>
    </Box>
  );
}
function LiabilitiesPage({ liabilities = [] }) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Liabilities</Typography>
      <ul>
        {liabilities.map((l, i) => (
          <li key={i}>
            {l.type}: ₹{l.value}
          </li>
        ))}
      </ul>
    </Box>
  );
}
function NetWorthPage({ assets = [], liabilities = [] }) {
  const totalAssets = assets.reduce((sum, a) => sum + (a.value || 0), 0);
  const totalLiabilities = liabilities.reduce(
    (sum, l) => sum + (l.value || 0),
    0
  );
  const netWorth = totalAssets + totalLiabilities;
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Net Worth</Typography>
      <Typography>Current Net Worth: ₹{netWorth}</Typography>
      <Typography color="text.secondary">
        (Assets: ₹{totalAssets} + Liabilities: ₹{totalLiabilities})
      </Typography>
    </Box>
  );
}
function CashflowPage({ cashflows = [], expenses = [] }) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Cashflow & Expenses</Typography>
      <Typography variant="subtitle1">Cashflows</Typography>
      <ul>
        {cashflows.map((c, i) => (
          <li key={i}>
            {c.source}: ₹{c.value}
          </li>
        ))}
      </ul>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Expenses
      </Typography>
      <ul>
        {expenses.map((e, i) => (
          <li key={i}>
            {e.category}: ₹{e.value}
          </li>
        ))}
      </ul>
    </Box>
  );
}
function DocumentsPage() {
  // Hardcoded documents
  const documents = [
    { name: "PAN Card.pdf", type: "PDF", uploaded: true },
    { name: "Aadhaar Card.pdf", type: "PDF", uploaded: true },
  ];
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Documents</Typography>
      <ul>
        {documents.map((doc, i) => (
          <li key={i}>
            {doc.name} ({doc.type}) -{" "}
            {doc.uploaded ? "Uploaded" : "Not uploaded"}
          </li>
        ))}
      </ul>
    </Box>
  );
}
function FamilyPage({ familyMembers = [] }) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Family Members</Typography>
      <ul>
        {familyMembers.map((m, i) => (
          <li key={i}>
            {m.name} ({m.role}){m.assets ? ` - Assets: ${m.assets}` : ""}
            {m.income ? ` - Income: ₹${m.income}` : ""}
          </li>
        ))}
      </ul>
    </Box>
  );
}
function InsightsPage() {
  // Hardcoded insights
  const insights = [
    "LIC policy renewal in 15 days",
    "ESOP vesting due next month",
  ];
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Insights & Alerts</Typography>
      <ul>
        {insights.map((ins, i) => (
          <li key={i}>{ins}</li>
        ))}
      </ul>
    </Box>
  );
}
function AdvisorPage() {
  // Hardcoded advisor contact
  const advisor = {
    name: "Rohit Sharma",
    email: "advisor@familyoffice.com",
    phone: "+91-9876543210",
    notes: "Reach out for any investment or planning queries.",
  };
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Advisor / Chat</Typography>
      <Typography>Name: {advisor.name}</Typography>
      <Typography>Email: {advisor.email}</Typography>
      <Typography>Phone: {advisor.phone}</Typography>
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        {advisor.notes}
      </Typography>
    </Box>
  );
}
function SettingsPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Settings / Billing</Typography>
      <Typography color="text.secondary">
        Settings and billing info will appear here.
      </Typography>
    </Box>
  );
}
// ...existing code...

const pageOrder = [
  "/", // LandingPage
  "/login", // SignupLogin
  "/onboarding", // OnboardingWizard
  "/connect-accounts", // ConnectAccounts
  "/add-mutual-funds", // AddMutualFunds
  "/add-insurance", // AddInsurance
  "/add-real-estate", // AddRealEstate
  "/add-liabilities", // AddLiabilities
  "/income-expenses", // IncomeExpenses
  "/setup-complete", // SetupComplete
  "/dashboard", // MainDashboard
];

function NavigationButtons() {
  const navigate = useNavigate();
  const location = useLocation();
  const idx = pageOrder.indexOf(location.pathname);
  // Only show on onboarding pages
  if (["/", "/login", "/dashboard"].includes(location.pathname)) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        background: "#fff",
        padding: 16,
        display: "flex",
        justifyContent: "center",
        zIndex: 1000,
        borderTop: "1px solid #eee",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => idx > 0 && navigate(pageOrder[idx - 1])}
        disabled={idx <= 0}
        sx={{ fontWeight: "bold", minWidth: 120 }}
      >
        Back
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          idx < pageOrder.length - 1 && navigate(pageOrder[idx + 1])
        }
        disabled={idx >= pageOrder.length - 1}
        sx={{ fontWeight: "bold", minWidth: 120, marginLeft: 2 }}
      >
        Next
      </Button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Set default route to Sign In page */}
        <Route path="/" element={<SignupLogin />} />
        <Route path="/login" element={<SignupLogin />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />
        <Route path="/connect-accounts" element={<ConnectAccounts />} />
        <Route path="/add-mutual-funds" element={<AddMutualFunds />} />
        <Route path="/add-insurance" element={<AddInsurance />} />
        <Route path="/add-real-estate" element={<AddRealEstate />} />
        <Route path="/add-liabilities" element={<AddLiabilities />} />
        <Route path="/income-expenses" element={<IncomeExpenses />} />
        <Route path="/setup-complete" element={<SetupComplete />} />
        {/* Nested dashboard routes for tabs */}
        <Route path="/dashboard/*" element={<MainDashboard />} />
        {/* Catch-all for unmatched routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <NavigationButtons />
    </Router>
  );
}

export default App;
