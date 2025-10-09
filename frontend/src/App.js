import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Button,
  TextField,
  Modal,
  Box,
  Typography,
  LinearProgress,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Box sx={{ mb: 4 }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Family Office Logo"
          style={{
            width: 80,
            height: 80,
            borderRadius: 16,
            boxShadow: "0 2px 8px #bdbdbd",
          }}
        />
      </Box>
      <Box sx={{ maxWidth: 480, width: "100%" }}>
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 4,
            boxShadow: 3,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            color="primary.main"
            gutterBottom
          >
            Family Office Platform
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Consolidate your entire family’s finances — investments, insurance,
            real estate, loans — in one secure dashboard.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              my: 2,
              fontWeight: "bold",
              fontSize: 20,
              px: 6,
              py: 1.5,
              borderRadius: 3,
              boxShadow: 2,
            }}
            onClick={() => navigate("/login")}
          >
            Sign In / Login
          </Button>
          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="primary.dark"
            >
              Key Features
            </Typography>
            <ul
              style={{
                textAlign: "left",
                display: "inline-block",
                margin: 0,
                paddingLeft: 20,
              }}
            >
              <li>Auto-fetch data via Account Aggregator</li>
              <li>Consolidated Net Worth</li>
              <li>Insurance & Policy tracker</li>
              <li>ESOP/RSU management</li>
              <li>Advisor chat & reports</li>
            </ul>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <b>Pricing tiers:</b> Basic | Premium | Family Office Concierge
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <b>Security Assurance:</b> DPDP-compliant, 256-bit encryption,
              SEBI registered (if applicable)
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const SignupLogin = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [referral, setReferral] = useState("");
  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Welcome Back / Create Account</h2>
      <TextField
        label="📱 Mobile Number"
        fullWidth
        margin="normal"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      {!otpSent && (
        <Button variant="contained" onClick={() => setOtpSent(true)}>
          Get OTP
        </Button>
      )}
      {otpSent && (
        <>
          <TextField
            label="OTP"
            fullWidth
            margin="normal"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <TextField
            label="Name (optional)"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email (optional)"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Referral Code (optional)"
            fullWidth
            margin="normal"
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <Button variant="outlined" color="primary" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate("/onboarding")}>Continue</Button>
          </div>
        </>
      )}
    </div>
  );
};

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

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <Typography variant="h6">Step 1: Family Profile</Typography>
      <LinearProgress
        variant="determinate"
        value={10}
        style={{ margin: "16px 0" }}
      />
      <TextField
        label="Family Name"
        fullWidth
        margin="normal"
        value={familyName}
        onChange={(e) => setFamilyName(e.target.value)}
      />
      <TextField
        label="Primary Contact"
        fullWidth
        margin="normal"
        value={primaryContact}
        onChange={(e) => setPrimaryContact(e.target.value)}
      />
      <div style={{ margin: "16px 0" }}>
        <Typography variant="subtitle1">Family Members</Typography>
        {members.map((m, idx) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            {m.name} ({m.relation}, {m.dob}, {m.role})
          </div>
        ))}
        <Button variant="outlined" onClick={() => setModalOpen(true)}>
          + Add Member
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <Button variant="outlined" color="primary" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate("/connect-accounts")}>Next</Button>
      </div>
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
          <Typography variant="h6">Add Family Member</Typography>
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
              "Father",
              "Mother",
              "Son",
              "Daughter",
              "Other",
            ].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="DOB"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newMember.dob}
            onChange={(e) =>
              setNewMember({ ...newMember, dob: e.target.value })
            }
          />
          <TextField
            label="Role"
            select
            fullWidth
            margin="normal"
            value={newMember.role}
            onChange={(e) =>
              setNewMember({ ...newMember, role: e.target.value })
            }
          >
            {["Decision Maker", "Viewer"].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={addMember}
            style={{ marginTop: 16 }}
          >
            Add
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

const ConnectAccounts = () => {
  const [option, setOption] = useState("A");
  const [manualBank, setManualBank] = useState({
    bank: "",
    account: "",
    ifsc: "",
    balance: "",
  });
  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <Typography variant="h6">
        Link your bank, mutual funds, and investments
      </Typography>
      <LinearProgress
        variant="determinate"
        value={20}
        style={{ margin: "16px 0" }}
      />
      <div style={{ margin: "24px 0" }}>
        <Button
          variant={option === "A" ? "contained" : "outlined"}
          onClick={() => setOption("A")}
        >
          🔗 Connect via Account Aggregator
        </Button>
        <Button
          variant={option === "B" ? "contained" : "outlined"}
          onClick={() => setOption("B")}
          style={{ marginLeft: 8 }}
        >
          📤 Upload Bank Statement
        </Button>
        <Button
          variant={option === "C" ? "contained" : "outlined"}
          onClick={() => setOption("C")}
          style={{ marginLeft: 8 }}
        >
          🖊 Enter Manually
        </Button>
      </div>
      {option === "A" && (
        <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
          <Typography>Select bank(s) / financial institutions</Typography>
          <Typography>
            Duration of consent: <b>3 months, 6 months, 1 year</b>
          </Typography>
          <Typography>
            Data categories: Accounts, Holdings, Transactions
          </Typography>
          <Button variant="contained" color="primary" style={{ marginTop: 8 }}>
            Grant Access ✅
          </Button>
        </Box>
      )}
      {option === "B" && (
        <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
          <Typography>Upload your bank statement (PDF, CSV, etc.)</Typography>
          <Button variant="contained" color="primary" style={{ marginTop: 8 }}>
            Upload
          </Button>
        </Box>
      )}
      {option === "C" && (
        <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
          <Typography>Enter your account details manually</Typography>
          <TextField
            label="Bank Name"
            fullWidth
            margin="normal"
            value={manualBank.bank}
            onChange={(e) =>
              setManualBank({ ...manualBank, bank: e.target.value })
            }
          />
          <TextField
            label="Account Number"
            fullWidth
            margin="normal"
            value={manualBank.account}
            onChange={(e) =>
              setManualBank({ ...manualBank, account: e.target.value })
            }
          />
          <TextField
            label="IFSC Code"
            fullWidth
            margin="normal"
            value={manualBank.ifsc}
            onChange={(e) =>
              setManualBank({ ...manualBank, ifsc: e.target.value })
            }
          />
          <TextField
            label="Balance"
            fullWidth
            margin="normal"
            value={manualBank.balance}
            onChange={(e) =>
              setManualBank({ ...manualBank, balance: e.target.value })
            }
          />
          <Button variant="contained" color="primary" style={{ marginTop: 8 }}>
            Save
          </Button>
        </Box>
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
  const [modalOpen, setModalOpen] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    insurer: "",
    type: "Health",
    number: "",
    sum: "",
    start: "",
    end: "",
  });
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
        <Button variant="outlined" onClick={() => setModalOpen(true)}>
          + Add Policy
        </Button>
        {policies.map((p, idx) => (
          <div key={idx} style={{ marginTop: 8 }}>
            {p.insurer} ({p.type}) - {p.number} - {p.sum} - {p.start} to {p.end}
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
              setModalOpen(false);
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

const AddRealEstate = () => {
  const [assets, setAssets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    type: "Real Estate",
    purchase: "",
    current: "",
    location: "",
    proof: "",
  });
  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <Typography variant="h6">Record your physical assets.</Typography>
      <LinearProgress
        variant="determinate"
        value={50}
        style={{ margin: "16px 0" }}
      />
      <div style={{ margin: "16px 0" }}>
        <Button variant="outlined" onClick={() => setModalOpen(true)}>
          + Add Asset
        </Button>
        {assets.map((a, idx) => (
          <div key={idx} style={{ marginTop: 8 }}>
            {a.type} - {a.purchase} - {a.current} - {a.location}
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
          <Typography variant="h6">Add Asset</Typography>
          <TextField
            label="Type"
            select
            fullWidth
            margin="normal"
            value={newAsset.type}
            onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })}
          >
            {["Real Estate", "Gold", "Art", "Others"].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Purchase Value"
            fullWidth
            margin="normal"
            value={newAsset.purchase}
            onChange={(e) =>
              setNewAsset({ ...newAsset, purchase: e.target.value })
            }
          />
          <TextField
            label="Current Value"
            fullWidth
            margin="normal"
            value={newAsset.current}
            onChange={(e) =>
              setNewAsset({ ...newAsset, current: e.target.value })
            }
          />
          <TextField
            label="Location (optional)"
            fullWidth
            margin="normal"
            value={newAsset.location}
            onChange={(e) =>
              setNewAsset({ ...newAsset, location: e.target.value })
            }
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setAssets([...assets, newAsset]);
              setModalOpen(false);
              setNewAsset({
                type: "Real Estate",
                purchase: "",
                current: "",
                location: "",
                proof: "",
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
  const [summary, setSummary] = useState([
    { label: "Total Net Worth", value: "-" },
    { label: "Total Assets", value: "-" },
    { label: "Total Liabilities", value: "-" },
    { label: "Monthly Cashflow", value: "-" },
  ]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [cashflows, setCashflows] = useState([]);
  const [netWorthTrend, setNetWorthTrend] = useState([]);
  const [assetAllocation, setAssetAllocation] = useState([]);

  React.useEffect(() => {
    // Fetch assets, liabilities, family, etc. from backend
    async function fetchData() {
      // Example: fetch assets for household 1 (replace with real household/user id logic)
      const householdId = 1;
      try {
        const assetsRes = await axios.get(
          `http://localhost:8000/api/v1/assets/?household_id=${householdId}`
        );
        setAssets(assetsRes.data.assets || []);
        // TODO: fetch liabilities, family, cashflows, etc.
        // Calculate summary
        let totalAssets = 0;
        let totalLiabilities = 0;
        let monthlyCashflow = 0;
        // Example: sum asset values if present
        for (const a of assetsRes.data.assets || []) {
          if (a.details && a.details.value)
            totalAssets += Number(a.details.value);
        }
        // TODO: fetch and sum liabilities
        // TODO: fetch and sum cashflows
        setSummary([
          {
            label: "Total Net Worth",
            value: `₹${totalAssets - totalLiabilities}`,
          },
          { label: "Total Assets", value: `₹${totalAssets}` },
          { label: "Total Liabilities", value: `₹${totalLiabilities}` },
          { label: "Monthly Cashflow", value: `₹${monthlyCashflow}` },
        ]);
        // TODO: set family members, net worth trend, asset allocation
      } catch (e) {
        // fallback to empty
      }
    }
    fetchData();
  }, []);

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
          ["🏠", "Dashboard"],
          ["💰", "Assets"],
          ["📉", "Liabilities"],
          ["📊", "Net Worth"],
          ["🧾", "Cashflow & Expenses"],
          ["📁", "Documents"],
          ["󰰁", "Family Members"],
          ["📅", "Insights & Alerts"],
          ["󰞴", "Advisor / Chat"],
          ["⚙️", "Settings / Billing"],
        ].map(([icon, label]) => (
          <Button
            key={label}
            fullWidth
            sx={{ justifyContent: "flex-start", mb: 1 }}
            startIcon={<span>{icon}</span>}
          >
            {label}
          </Button>
        ))}
      </Box>
      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#fff",
            px: 3,
            py: 2,
            borderBottom: "1px solid #eee",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Button variant="text">Kakani Family ▼</Button>
          </Box>
          <Box sx={{ flex: 1, textAlign: "center" }}>
            {new Date().toLocaleDateString()}
          </Box>
          <Box sx={{ flex: 1, textAlign: "right" }}>
            <Button>
              <span role="img" aria-label="notifications">
                🔔
              </span>
            </Button>
            <Button>
              <span role="img" aria-label="help">
                ❓
              </span>
            </Button>
            <Button>
              <span role="img" aria-label="profile">
                👤
              </span>
            </Button>
          </Box>
        </Box>
        {/* Dashboard Content */}
        <Box sx={{ display: "flex", flex: 1, overflow: "auto" }}>
          {/* Main Section */}
          <Box sx={{ flex: 2, p: 3 }}>
            {/* Summary Cards */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              {summary.map((card) => (
                <Box
                  key={card.label}
                  sx={{
                    flex: 1,
                    bgcolor: "#fff",
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    {card.label}
                  </Typography>
                  <Typography variant="h6">{card.value}</Typography>
                </Box>
              ))}
            </Box>
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
                  <Typography color="text.secondary">
                    [Line Chart Placeholder]
                  </Typography>
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
                  <Typography color="text.secondary">
                    [Bar Chart Placeholder]
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* Recent Transactions Table */}
            <Box
              sx={{
                bgcolor: "#fff",
                p: 2,
                borderRadius: 2,
                boxShadow: 1,
                mb: 3,
              }}
            >
              <Typography variant="subtitle1">Recent Transactions</Typography>
              <Box sx={{ mt: 1 }}>
                <Typography color="text.secondary">
                  [Table Placeholder]
                </Typography>
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
              sx={{
                bgcolor: "#fff",
                p: 2,
                borderRadius: 2,
                boxShadow: 1,
                mb: 3,
              }}
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
      </Box>
    </Box>
  );
};

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
      <h1>Family Office Platform</h1>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SignupLogin />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />
        <Route path="/connect-accounts" element={<ConnectAccounts />} />
        <Route path="/add-mutual-funds" element={<AddMutualFunds />} />
        <Route path="/add-insurance" element={<AddInsurance />} />
        <Route path="/add-real-estate" element={<AddRealEstate />} />
        <Route path="/add-liabilities" element={<AddLiabilities />} />
        <Route path="/income-expenses" element={<IncomeExpenses />} />
        <Route path="/setup-complete" element={<SetupComplete />} />
        <Route path="/dashboard" element={<MainDashboard />} />
      </Routes>
      <NavigationButtons />
    </Router>
  );
}

export default App;
