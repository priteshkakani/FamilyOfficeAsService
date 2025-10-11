// --- MAIN APP ENTRY ---
// --- MAIN APP ENTRY ---
function App() {
  // Simulate onboarding complete
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 = Home

  // Mock user and summary data
  const user = { name: "Pritesh" };
  const familySummary = { members: 4, assets: 7, liabilities: 2 };
  const summaryCards = [
    { label: "Net Worth", value: "₹2.43 Cr" },
    { label: "Assets", value: "₹3.10 Cr" },
    { label: "Liabilities", value: "₹0.67 Cr" },
    { label: "Insurance", value: "₹1.2 Cr" },
  ];
  const mainCards = [
    {
      label: "Net Worth",
      icon: <BarChart2 className="w-6 h-6 text-blue-600" />,
      content: <div className="text-3xl font-bold">₹2.43 Cr</div>,
      footer: "All assets – liabilities",
    },
    {
      label: "Assets Breakdown",
      icon: <PieChart className="w-6 h-6 text-green-600" />,
      content: (
        <ResponsiveContainer width="100%" height={120}>
          <RePieChart>
            <Pie
              dataKey="value"
              data={[
                { name: "Equity", value: 40 },
                { name: "MF", value: 30 },
                { name: "RE", value: 20 },
                { name: "Gold", value: 10 },
              ]}
              cx="50%"
              cy="50%"
              outerRadius={40}
              fill="#8884d8"
              label
            >
              <Cell fill="#8884d8" />
              <Cell fill="#82ca9d" />
              <Cell fill="#ffc658" />
              <Cell fill="#ff8042" />
            </Pie>
            <Legend />
          </RePieChart>
        </ResponsiveContainer>
      ),
      footer: "Equity, MF, RE, Gold, Others",
    },
    {
      label: "Income vs Expense",
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      content: (
        <ResponsiveContainer width="100%" height={120}>
          <BarChart
            data={[
              { name: "Jan", income: 100, expense: 80 },
              { name: "Feb", income: 120, expense: 90 },
            ]}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="income" fill="#8884d8" />
            <Bar dataKey="expense" fill="#ff8042" />
          </BarChart>
        </ResponsiveContainer>
      ),
      footer: "Income + Expense",
    },
    {
      label: "Insurance Coverage",
      icon: <Shield className="w-6 h-6 text-cyan-600" />,
      content: <div className="text-lg">Total: ₹1.2 Cr</div>,
      footer: "Sum Assured vs Required",
    },
    {
      label: "Retirement Goal Progress",
      icon: <User className="w-6 h-6 text-orange-600" />,
      content: <div className="text-lg">Progress: 62%</div>,
      footer: "% to goal",
    },
    {
      label: "Latest Updates",
      icon: <FileBarChart2 className="w-6 h-6 text-gray-600" />,
      content: <div className="text-gray-500">New ITR data available</div>,
      footer: "SurePass/AIS",
    },
  ];

  if (!isOnboarded) {
    // ...existing onboarding or login logic...
    return <OnboardingWizard />;
  }

  // Dashboard UI
  return (
    <DashboardLayout
      user={user}
      familySummary={familySummary}
      summaryCards={summaryCards}
      mainCards={mainCards}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === 0 && (
        <DashboardHomeTab
          user={user}
          familySummary={familySummary}
          summaryCards={summaryCards}
          mainCards={mainCards}
        />
      )}
      {/* TODO: Render other tabs based on activeTab */}
    </DashboardLayout>
  );
}
// --- DASHBOARD LAYOUT ---
function DashboardLayout({
  user = { name: "Pritesh" },
  familySummary,
  summaryCards,
  mainCards,
  children,
  activeTab,
  setActiveTab,
}) {
  const tabs = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Home" },
    { icon: <Users className="w-5 h-5" />, label: "Family" },
    { icon: <BarChart2 className="w-5 h-5" />, label: "Assets" },
    { icon: <CreditCard className="w-5 h-5" />, label: "Liabilities" },
    { icon: <Receipt className="w-5 h-5" />, label: "Income & Expenses" },
    { icon: <Shield className="w-5 h-5" />, label: "Insurance" },
    { icon: <Coins className="w-5 h-5" />, label: "ESOPs / RSUs" },
    { icon: <Banknote className="w-5 h-5" />, label: "EPFO / ITR / AIS" },
    { icon: <FileBarChart2 className="w-5 h-5" />, label: "Reports" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings" },
  ];
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white shadow flex flex-col gap-2 p-4">
        <div className="text-xl font-bold text-blue-700 mb-4">
          Family Office
        </div>
        {tabs.map((tab, idx) => (
          <Button
            key={tab.label}
            variant={activeTab === idx ? "default" : "ghost"}
            className={`justify-start font-semibold rounded-lg mb-1 w-full ${
              activeTab === idx ? "bg-blue-50 text-blue-700" : "text-gray-700"
            }`}
            onClick={() => setActiveTab(idx)}
            startIcon={tab.icon}
          >
            {tab.label}
          </Button>
        ))}
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col">{children}</main>
    </div>
  );
}

// --- DASHBOARD HOME TAB ---
function DashboardHomeTab({ user, familySummary, summaryCards, mainCards }) {
  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <div className="text-2xl font-bold mb-1 flex items-center">
            <User className="w-6 h-6 mr-2 text-blue-600" />
            Welcome, {user.name}
          </div>
          <div className="text-gray-500">
            Family Summary: {familySummary.members} Members,{" "}
            {familySummary.assets} Assets, {familySummary.liabilities}{" "}
            Liabilities
          </div>
        </div>
        {/* Placeholder for notifications or quick actions */}
        <Button variant="outline">Notifications</Button>
      </div>
      {/* Summary Cards */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {summaryCards.map((card) => (
          <Card
            key={card.label}
            className="w-48 p-4 flex flex-col items-center justify-center shadow"
          >
            <div className="text-lg font-semibold mb-1">{card.label}</div>
            <div className="text-2xl font-bold mb-1">{card.value}</div>
          </Card>
        ))}
      </div>
      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mainCards.map((card) => (
          <Card key={card.label} className="p-4 flex flex-col shadow">
            <div className="flex items-center mb-2">
              <span className="mr-2">{card.icon}</span>
              <span className="font-semibold text-lg">{card.label}</span>
            </div>
            <div className="flex-1 mb-2">{card.content}</div>
            <div className="text-xs text-gray-500 mt-auto">{card.footer}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
import React, { useState, useEffect, useRef } from "react";
import {
  BarChart2,
  PieChart,
  User,
  FileBarChart2,
  Shield,
  TrendingUp,
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  Coins,
  Banknote,
  Settings,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  BarChart,
  Tooltip,
  Legend,
  Cell,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
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

// (ConnectAccounts page removed)
// NotFoundPage for unmatched routes
function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
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
          mb: 2,
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
  // --- NEW 6-STEP ONBOARDING WIZARD ---
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1: Welcome / Profile Setup
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
    country: "",
    dob: "",
    occupation: "",
    incomeRange: "",
  });

  // Step 2: Family Setup
  const [familyMembers, setFamilyMembers] = useState([]);

  // Step 3: Financial Data Sources
  const [dataSources, setDataSources] = useState({
    pan: false,
    epfo: false,
    stocks: false,
    mutualFunds: false,
    esops: false,
    realEstate: false,
    insurance: false,
  });
  const [panInput, setPanInput] = useState("");
  const [epfoInput, setEpfoInput] = useState({ uan: "", mobile: "", otp: "" });
  const [incomeExpense, setIncomeExpense] = useState({
    income: "",
    expense: "",
    loans: [],
    savingsRate: "",
  });
  const [goals, setGoals] = useState([]);
  const [preferences, setPreferences] = useState({
    risk: "",
    horizon: 5,
    frequency: "Monthly",
  });
  const nextStep = () => setStep((s) => Math.min(s + 1, 6));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return null;
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
              </svg>
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

export default App;
