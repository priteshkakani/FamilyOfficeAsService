import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

// Placeholder components for each page
const LandingPage = () => <div>Landing Page (Before Login)</div>;
const SignupLogin = () => <div>Signup / Login Flow</div>;
const OnboardingWizard = () => (
  <div>Onboarding Wizard (Multi-step, smooth progress bar on top)</div>
);
const ConnectAccounts = () => <div>Connect Financial Accounts</div>;
const AddMutualFunds = () => <div>Add Mutual Funds / Stocks</div>;
const AddInsurance = () => <div>Add Insurance</div>;
const AddRealEstate = () => <div>Add Real Estate / Gold / Other Assets</div>;
const AddLiabilities = () => <div>Add Liabilities</div>;
const IncomeExpenses = () => <div>Income & Expenses</div>;
const SetupComplete = () => <div>Final Screen: Setup Complete!</div>;
const MainDashboard = () => <div>Main Dashboard (After Login)</div>;

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
  return (
    <div style={{ margin: "20px 0" }}>
      <button
        onClick={() => idx > 0 && navigate(pageOrder[idx - 1])}
        disabled={idx <= 0}
      >
        Back
      </button>
      <button
        onClick={() =>
          idx < pageOrder.length - 1 && navigate(pageOrder[idx + 1])
        }
        disabled={idx >= pageOrder.length - 1}
        style={{ marginLeft: 8 }}
      >
        Next
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <h1>Family Office Platform</h1>
      <NavigationButtons />
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
    </Router>
  );
}

export default App;
