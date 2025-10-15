import React from "react";
// Fallbacks for missing dashboard pages
const AssetsPage = () => <Box sx={{ p: 4 }}>Assets Page (placeholder)</Box>;
const LiabilitiesPage = () => (
  <Box sx={{ p: 4 }}>Liabilities Page (placeholder)</Box>
);
const InsurancePage = () => (
  <Box sx={{ p: 4 }}>Insurance Page (placeholder)</Box>
);
const EPFOPage = () => <Box sx={{ p: 4 }}>EPFO Page (placeholder)</Box>;
const ReportsPage = () => <Box sx={{ p: 4 }}>Reports Page (placeholder)</Box>;
// --- RequireOnboarded: Checks if user is onboarded, redirects if not ---
import { Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Fallback DashboardSkeleton if not defined elsewhere
const DashboardSkeleton = () => (
  <Box sx={{ p: 4, textAlign: "center" }}>
    <CircularProgress />
    <Typography variant="body1" sx={{ mt: 2 }}>
      Loading...
    </Typography>
  </Box>
);
import { useNavigate } from "react-router-dom";
import { useAuthState } from "./useAuthState";

function RequireOnboarded({ children }) {
  const navigate = useNavigate();
  const { loading, session, profile } = useAuthState();
  React.useEffect(() => {
    if (!loading) {
      if (!session) {
        navigate("/login", { replace: true });
      } else if (profile && !profile.is_onboarded) {
        navigate("/onboarding", { replace: true });
      }
    }
  }, [loading, session, profile, navigate]);
  if (loading) {
    return (
      <div className="text-center py-12" data-testid="loading">
        Loading...
      </div>
    );
  }
  // Only render children if session exists and user is onboarded
  if (!session || (profile && !profile.is_onboarded)) {
    // After loading, if not authenticated or not onboarded, let redirect happen, but keep loading marker until redirect
    return <div data-testid="loading">Loading...</div>;
  }
  return children;
}
import OnboardingWizard from "./components/OnboardingWizard/OnboardingWizard.jsx";
import AuthForm from "./AuthForm";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
// EPFO Data Table Component
function EPFODataTable({ userId }) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["epfo_data", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("epfo_data")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
  const refreshMutation = useMutation({
    mutationFn: async () => {
      await axios.post("/api/v1/epfo/refetch", { user_id: userId });
    },
    onSuccess: () => refetch(),
  });
  if (isLoading)
    return <div className="text-center py-8">Loading EPFO data...</div>;
  if (isError)
    return (
      <div className="text-center py-8 text-red-500">
        Error loading EPFO data.
      </div>
    );
  if (!data?.length)
    return (
      <div className="text-center py-8 text-gray-500">No EPFO data found.</div>
    );
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">EPFO Passbook Entries</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => refreshMutation.mutate()}
          disabled={refreshMutation.isLoading}
        >
          {refreshMutation.isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      <table className="min-w-full text-left border">
        <thead>
          <tr>
            <th className="border-b p-2">Establishment</th>
            <th className="border-b p-2">Employee Contribution</th>
            <th className="border-b p-2">Employer Contribution</th>
            <th className="border-b p-2">Total Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b">
              <td className="p-2">
                {row.establishment || row.establishment_name}
              </td>
              <td className="p-2">₹{row.employee_contribution || 0}</td>
              <td className="p-2">₹{row.employer_contribution || 0}</td>
              <td className="p-2 font-bold">
                ₹{row.balance || row.total_balance || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// Removed duplicate DashboardLayout definition. Only one should exist.

// --- DASHBOARD HOME TAB ---
// Removed duplicate DashboardHomeTab definition. Only one should exist.
// Removed duplicate mutationFn and related code. All EPFO logic is now inside EPFODataTable component.
// End of EPFODataTable usage

// --- Reusable Supabase hooks with react-query ---

function useUserId() {
  const [userId, setUserId] = React.useState(null);
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id || null);
      }
    );
    return () => listener?.unsubscribe?.();
  }, []);
  return userId;
}

function useAssets() {
  const userId = useUserId();
  const query = useQuery({
    queryKey: ["assets", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("user_id", userId);
      return data || [];
    },
    enabled: !!userId,
  });
  const queryClient = useQueryClient();
  const insert = useMutation({
    mutationFn: async (row) => {
      const { data, error } = await supabase
        .from("assets")
        .insert([{ ...row, user_id: userId }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(["assets", userId]),
  });
  const update = useMutation({
    mutationFn: async (row) => {
      const { data, error } = await supabase
        .from("assets")
        .update(row)
        .eq("id", row.id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(["assets", userId]),
  });
  const remove = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("assets").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries(["assets", userId]),
  });
  return { ...query, insert, update, remove };
}

function useLiabilities() {
  const userId = useUserId();
  const query = useQuery({
    queryKey: ["liabilities", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("liabilities")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
  const queryClient = useQueryClient();
  const insert = useMutation({
    mutationFn: async (row) => {
      const { data, error } = await supabase
        .from("liabilities")
        .insert([{ ...row, user_id: userId }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(["liabilities", userId]),
  });
  const update = useMutation({
    mutationFn: async (row) => {
      const { data, error } = await supabase
        .from("liabilities")
        .update(row)
        .eq("id", row.id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(["liabilities", userId]),
  });
  const remove = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("liabilities")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries(["liabilities", userId]),
  });
  return { ...query, insert, update, remove };
}

function useInsurance() {
  const userId = useUserId();
  const query = useQuery({
    queryKey: ["insurance", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("insurance")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
  const queryClient = useQueryClient();
  const insert = useMutation({
    mutationFn: async (row) => {
      const { data, error } = await supabase
        .from("insurance")
        .insert([{ ...row, user_id: userId }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(["insurance", userId]),
  });
  const update = useMutation({
    mutationFn: async (row) => {
      const { data, error } = await supabase
        .from("insurance")
        .update(row)
        .eq("id", row.id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(["insurance", userId]),
  });
  const remove = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("insurance").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries(["insurance", userId]),
  });
  return { ...query, insert, update, remove };
}

// Removed duplicate App definition. Only one should exist.
// Removed duplicate ProtectedRoute definition. Only one should exist.

// Generic Table Page
function TablePage({ table, title, columns }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [table],
    queryFn: async () => (await supabase.from(table).select("*")).data || [],
  });
  if (isLoading)
    return <div className="text-center py-12">Loading {title}...</div>;
  if (isError)
    return (
      <div className="text-center py-12 text-red-500">
        Error loading {title}.
      </div>
    );
  if (!data?.length)
    return (
      <div className="text-center py-12 text-gray-500">
        No {title} data found.
      </div>
    );
  // Calculate summary
  const total = data.reduce((sum, row) => sum + (row.value || 0), 0);
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="font-semibold">Total: ₹{total.toLocaleString()}</div>
      </div>
      <table className="min-w-full text-left border">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="border-b p-2">
                {col}
              </th>
            ))}
            <th className="border-b p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b">
              {columns.map((col) => (
                <td key={col} className="p-2">
                  {row[col]}
                </td>
              ))}
              <td className="p-2">
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  style={{ marginRight: 8 }}
                >
                  Edit
                </Button>
                <Button size="small" variant="outlined" color="error">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ...existing code...
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
    // LandingPage component with Next button
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
function DashboardHomeTab() {
  // TanStack Query fetches
  const assetsQ = useQuery({
    queryKey: ["assets"],
    queryFn: async () => (await supabase.from("assets").select("*")).data || [],
  });
  const liabilitiesQ = useQuery({
    queryKey: ["liabilities"],
    queryFn: async () =>
      (await supabase.from("liabilities").select("*")).data || [],
  });
  const insuranceQ = useQuery({
    queryKey: ["insurance"],
    queryFn: async () =>
      (await supabase.from("insurance").select("*")).data || [],
  });
  const epfoQ = useQuery({
    queryKey: ["epfo_data"],
    queryFn: async () =>
      (await supabase.from("epfo_data").select("*")).data || [],
  });

  const isLoading =
    assetsQ.isLoading ||
    liabilitiesQ.isLoading ||
    insuranceQ.isLoading ||
    epfoQ.isLoading;
  const isError =
    assetsQ.isError ||
    liabilitiesQ.isError ||
    insuranceQ.isError ||
    epfoQ.isError;

  // Calculate summary
  const totalAssets =
    assetsQ.data?.reduce((sum, a) => sum + (a.value || 0), 0) || 0;
  const totalLiabilities =
    liabilitiesQ.data?.reduce((sum, l) => sum + (l.value || 0), 0) || 0;
  const netWorth = totalAssets - totalLiabilities;
  const totalIncome =
    assetsQ.data?.reduce((sum, a) => sum + (a.income || 0), 0) || 0;
  const totalExpense =
    liabilitiesQ.data?.reduce((sum, l) => sum + (l.expense || 0), 0) || 0;
  const epfoSummary = epfoQ.data?.length ? epfoQ.data[0] : null;

  if (isLoading)
    return <div className="text-center py-12">Loading dashboard...</div>;
  if (isError)
    return (
      <div className="text-center py-12 text-red-500">
        Error loading dashboard data.
      </div>
    );
  if (!assetsQ.data?.length && !liabilitiesQ.data?.length)
    return (
      <div className="text-center py-12 text-gray-500">
        No financial data found. Start by adding assets and liabilities.
      </div>
    );

  // Cards data
  const summaryCards = [
    { label: "Total Assets", value: `₹${totalAssets.toLocaleString()}` },
    {
      label: "Total Liabilities",
      value: `₹${totalLiabilities.toLocaleString()}`,
    },
    { label: "Net Worth", value: `₹${netWorth.toLocaleString()}` },
    {
      label: "Income vs Expense",
      value: `₹${totalIncome.toLocaleString()} / ₹${totalExpense.toLocaleString()}`,
    },
    {
      label: "EPFO Summary",
      value: epfoSummary ? `Balance: ₹${epfoSummary.balance}` : "No EPFO data",
    },
  ];

  // Pie chart for asset allocation
  const assetPieData =
    assetsQ.data?.map((a) => ({ name: a.type || a.name, value: a.value })) ||
    [];
  // Bar chart for income vs expense
  const incomeExpenseData = [
    { name: "This Month", income: totalIncome, expense: totalExpense },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <div className="text-2xl font-bold mb-1 flex items-center">
            Dashboard
          </div>
        </div>
      </div>
      <div className="flex gap-4 mb-6 flex-wrap">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-lg shadow p-4 min-w-[180px] flex flex-col items-center"
          >
            <div className="text-lg font-semibold mb-1">{card.label}</div>
            <div className="text-2xl font-bold mb-1">{card.value}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="font-semibold mb-2">Asset Allocation</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={assetPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              >
                {assetPieData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={
                      ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"][
                        idx % 5
                      ]
                    }
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="font-semibold mb-2">Income vs Expense</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={incomeExpenseData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#8884d8" />
              <Bar dataKey="expense" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-8 bg-white rounded-lg shadow p-4">
        <div className="font-semibold mb-2">EPFO Details</div>
        {epfoSummary ? (
          <div>
            <div>Balance: ₹{epfoSummary.balance}</div>
            <div>UAN: {epfoSummary.uan}</div>
            {/* Add more EPFO fields as needed */}
          </div>
        ) : (
          <div className="text-gray-500">No EPFO data available.</div>
        )}
      </div>
    </div>
  );
}
// Investment Advice Details Page
function InvestmentAdvicePage() {
  const smallcases = [
    {
      name: "Top Tech Innovators",
      desc: "Diversified tech sector smallcase.",
    },
    {
      name: "Green Energy Leaders",
      desc: "Focus on renewable energy companies.",
    },
    { name: "India Rising", desc: "Growth-oriented Indian equities." },
  ];
  const mutualFunds = [
    { name: "HDFC Flexi Cap Fund", desc: "Large & mid cap equity fund." },
    {
      name: "Mirae Asset Large Cap",
      desc: "Consistent large cap performer.",
    },
    {
      name: "Parag Parikh Flexi Cap",
      desc: "Diversified, value-driven fund.",
    },
  ];
  const stocks = [
    { name: "Reliance Industries", desc: "Conglomerate, energy & retail." },
    { name: "Tata Consultancy Services", desc: "IT services leader." },
    { name: "HDFC Bank", desc: "Top private sector bank." },
  ];
  const realEstate = [
    {
      name: "Prestige Shantiniketan",
      desc: "Bangalore residential project.",
    },
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

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          fontSize: 32,
          marginBottom: 24,
        }}
      >
        Welcome to Family Office
      </div>
      <p style={{ fontSize: 18, marginBottom: 32 }}>
        Your personal finance dashboard
      </p>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate("/login")}
      >
        Sign In / Sign Up
      </Button>
    </div>
  );
}

// --- ProtectedRoute moved above App for scope ---
function ProtectedRoute({ children }) {
  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      listener?.unsubscribe?.();
    };
  }, []);
  if (loading)
    return <div className="text-center py-12">Checking authentication...</div>;
  if (!session || !session.user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Main App component (restored)

// Extracted AppRoutes for testability
export function AppRoutes() {
  // Lazy load DashboardHomeTab for test mocking
  const DashboardHomeTab = React.lazy(() =>
    import("./components/DashboardHomeTab")
  );
  const ForgotPassword = React.lazy(() => import("./ForgotPassword"));
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthForm mode="login" />} />
      <Route path="/signup" element={<AuthForm mode="signup" />} />
      <Route
        path="/forgot-password"
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <ForgotPassword />
          </React.Suspense>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingWizard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RequireOnboarded>
              <React.Suspense fallback={<DashboardSkeleton />}>
                <DashboardHomeTab />
              </React.Suspense>
            </RequireOnboarded>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/assets"
        element={
          <ProtectedRoute>
            <RequireOnboarded>
              <React.Suspense fallback={<DashboardSkeleton />}>
                <AssetsPage />
              </React.Suspense>
            </RequireOnboarded>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/liabilities"
        element={
          <ProtectedRoute>
            <RequireOnboarded>
              <React.Suspense fallback={<DashboardSkeleton />}>
                <LiabilitiesPage />
              </React.Suspense>
            </RequireOnboarded>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/insurance"
        element={
          <ProtectedRoute>
            <RequireOnboarded>
              <React.Suspense fallback={<DashboardSkeleton />}>
                <InsurancePage />
              </React.Suspense>
            </RequireOnboarded>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/epfo"
        element={
          <ProtectedRoute>
            <RequireOnboarded>
              <React.Suspense fallback={<DashboardSkeleton />}>
                <EPFOPage />
              </React.Suspense>
            </RequireOnboarded>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/reports"
        element={
          <ProtectedRoute>
            <RequireOnboarded>
              <React.Suspense fallback={<DashboardSkeleton />}>
                <ReportsPage />
              </React.Suspense>
            </RequireOnboarded>
          </ProtectedRoute>
        }
      />
      {/* Add more dashboard routes as needed */}
    </Routes>
  );
}

// App now just provides BrowserRouter and AppRoutes
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
