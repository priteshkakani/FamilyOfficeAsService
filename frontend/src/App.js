// ...existing code...

function SignupLogin() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode") || "signin";
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    setError("");
    // TODO: Call backend for OTP send (login or signup)
    setStep(2);
  };
  const handleVerifyOtp = async () => {
    setError("");
    // TODO: Call backend for OTP verify
    navigate("/dashboard");
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
          Enter your mobile number to{" "}
          {mode === "signup" ? "create an account" : "sign in"}.
        </Typography>
        <input
          type="tel"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            fontSize: 16,
            borderRadius: 6,
            border: "1px solid #ccc",
            marginBottom: 16,
          }}
        />
        {step === 1 && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ fontWeight: 700, mb: 2 }}
            onClick={handleSendOtp}
          >
            Get OTP
          </Button>
        )}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
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
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </Button>
          </>
        )}
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

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <Typography variant="h6">Step 1: Family Profile</Typography>
      <LinearProgress
        variant="determinate"
        value={10}
        style={{ margin: "16px 0" }}
      />
      {/* ...rest of OnboardingWizard content... */}
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
  // Hardcoded values for dashboard summary
  const hardcodedAssets = 1000000;
  const hardcodedLiabilities = 200000;
  const hardcodedNetWorth = hardcodedAssets + hardcodedLiabilities; // as per user request
  const hardcodedMonthlyIncome = 120000; // sum of family incomes
  const hardcodedMonthlySavings = 30000;
  const hardcodedMonthlyCashflow = 90000;
  const [adviceOpen, setAdviceOpen] = useState(false);
  const investmentAdvice = [
    { type: "Smallcases", advice: "Diversify with top smallcases for 2025." },
    { type: "Mutual Funds", advice: "Increase SIP in large-cap funds." },
    { type: "Stocks", advice: "Review direct equity for rebalancing." },
    { type: "Real Estate", advice: "Consider REITs for liquidity." },
  ];
  const [summary, setSummary] = useState([
    { label: "Total Net Worth", value: `₹${hardcodedNetWorth}` },
    { label: "Total Assets", value: `₹${hardcodedAssets}` },
    { label: "Total Liabilities", value: `₹${hardcodedLiabilities}` },
    { label: "Monthly Income", value: `₹${hardcodedMonthlyIncome}` },
    { label: "Monthly Savings", value: `₹${hardcodedMonthlySavings}` },
    { label: "Monthly Cashflow", value: `₹${hardcodedMonthlyCashflow}` },
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
  ]);
  // Hardcoded family members and asset allocation for now
  const [familyMembers, setFamilyMembers] = useState([
    { name: "Amit", age: 45, role: "Primary", assets: "₹7L", income: 70000 },
    { name: "Priya", age: 42, role: "Spouse", assets: "₹5L", income: 50000 },
  ]);
  const [assets, setAssets] = useState([
    { type: "Bank Account", value: 400000 },
    { type: "Mutual Funds", value: 300000 },
    { type: "Stocks", value: 200000 },
    { type: "Real Estate", value: 100000 },
  ]);
  const [liabilities, setLiabilities] = useState([
    { type: "Home Loan", value: 150000 },
    { type: "Car Loan", value: 50000 },
  ]);
  const [cashflows, setCashflows] = useState([
    { source: "Salary", value: 70000 },
    { source: "Business", value: 50000 },
  ]);
  const [netWorthTrend, setNetWorthTrend] = useState([
    { month: "Jan", value: 1000000 },
    { month: "Feb", value: 1100000 },
    { month: "Mar", value: 1200000 },
    { month: "Apr", value: 1300000 },
    { month: "May", value: 1400000 },
  ]);
  const [assetAllocation, setAssetAllocation] = useState([
    { type: "Bank Account", value: 40 },
    { type: "Mutual Funds", value: 30 },
    { type: "Stocks", value: 20 },
    { type: "Real Estate", value: 10 },
  ]);

  // No backend fetch, use hardcoded data

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
          ["🏠", "Dashboard", "/dashboard"],
          ["💰", "Assets", "/assets"],
          ["📉", "Liabilities", "/liabilities"],
          ["📊", "Net Worth", "/net-worth"],
          ["🧾", "Cashflow & Expenses", "/cashflow"],
          ["📁", "Documents", "/documents"],
          ["󰰁", "Family Members", "/family"],
          ["📅", "Insights & Alerts", "/insights"],
          ["󰞴", "Advisor / Chat", "/advisor"],
          ["⚙️", "Settings / Billing", "/settings"],
        ].map(([icon, label, path]) => (
          <Button
            key={label}
            fullWidth
            sx={{ justifyContent: "flex-start", mb: 1 }}
            startIcon={<span>{icon}</span>}
            onClick={() =>
              window.location.pathname !== path &&
              window.history.pushState({}, "", path)
            }
          >
            {label}
          </Button>
        ))}
      </Box>
      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Dashboard Routing */}
        <Routes>
          <Route
            path="/dashboard"
            element={
              <DashboardHome
                summary={summary}
                adviceOpen={adviceOpen}
                setAdviceOpen={setAdviceOpen}
                investmentAdvice={investmentAdvice}
                familyMembers={familyMembers}
              />
            }
          />
          <Route path="/assets" element={<AssetsPage assets={assets} />} />
          <Route
            path="/liabilities"
            element={<LiabilitiesPage liabilities={liabilities} />}
          />
          <Route
            path="/net-worth"
            element={<NetWorthPage netWorth={hardcodedNetWorth} />}
          />
          <Route
            path="/cashflow"
            element={<CashflowPage cashflows={cashflows} />}
          />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route
            path="/family"
            element={<FamilyPage familyMembers={familyMembers} />}
          />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/advisor" element={<AdvisorPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Default route */}
          <Route
            path="*"
            element={
              <DashboardHome
                summary={summary}
                adviceOpen={adviceOpen}
                setAdviceOpen={setAdviceOpen}
                investmentAdvice={investmentAdvice}
                familyMembers={familyMembers}
              />
            }
          />
        </Routes>
      </Box>
    </Box>
  );
};

// Simple pages for each tab (move outside MainDashboard)
function InsightsPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Insights & Alerts</Typography>
      <Typography color="text.secondary">No insights available.</Typography>
    </Box>
  );
}
function AdvisorPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Advisor / Chat</Typography>
      <Typography color="text.secondary">
        Chat with your advisor coming soon.
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
// Dashboard Home Page
function DashboardHome({
  summary,
  adviceOpen,
  setAdviceOpen,
  investmentAdvice,
  familyMembers,
}) {
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
  );
}

// Simple pages for each tab
function AssetsPage({ assets }) {
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
function LiabilitiesPage({ liabilities }) {
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
function NetWorthPage({ netWorth }) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Net Worth</Typography>
      <Typography>Current Net Worth: ₹{netWorth}</Typography>
    </Box>
  );
}
function CashflowPage({ cashflows }) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Cashflow & Expenses</Typography>
      <ul>
        {cashflows.map((c, i) => (
          <li key={i}>
            {c.source}: ₹{c.value}
          </li>
        ))}
      </ul>
    </Box>
  );
}
function DocumentsPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Documents</Typography>
      <Typography color="text.secondary">No documents uploaded yet.</Typography>
    </Box>
  );
}
function FamilyPage({ familyMembers }) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Family Members</Typography>
      <ul>
        {familyMembers.map((m, i) => (
          <li key={i}>
            {m.name} ({m.role}) - Assets: {m.assets} - Income: ₹{m.income}
          </li>
        ))}
      </ul>
    </Box>
  );
}
function InsightsPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Insights & Alerts</Typography>
      <Typography color="text.secondary">No insights available.</Typography>
    </Box>
  );
}
function AdvisorPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Advisor / Chat</Typography>
      <Typography color="text.secondary">
        Chat with your advisor coming soon.
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
    <ErrorBoundary>
      <Router>
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
    </ErrorBoundary>
  );
}

export default App;
