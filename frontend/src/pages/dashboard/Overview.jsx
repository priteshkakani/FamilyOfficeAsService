import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import PortfolioPanel from "./Portfolio";
import TransactionPanel from "./Transaction";
import ProfilePanel from "./Profile";
import formatINR from "../../utils/formatINR";
import { useClient } from "../../hooks/useClientContext";
import useClientData from "../../hooks/useClientData";
import KpiCard from "../../components/dashboard/KpiCard";
import IncomeExpenseChart from "../../components/dashboard/IncomeExpenseChart";
import AssetAllocationDonut from "../../components/dashboard/AssetAllocationDonut";

export default function Overview() {
  // Sub-tabs
  const subTabs = [
    { key: "overview", label: "Overview", testid: "tab-ov-overview" },
    { key: "portfolio", label: "Portfolio", testid: "tab-ov-portfolio" },
    { key: "transaction", label: "Transaction", testid: "tab-ov-transaction" },
    { key: "profile", label: "Profile", testid: "tab-ov-profile" },
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.pathname.split("/").pop() || "overview";
  React.useEffect(() => {
    localStorage.setItem("last-ov-subtab", currentTab);
  }, [currentTab]);
  React.useEffect(() => {
    if (location.pathname === "/dashboard/overview") {
      const last = localStorage.getItem("last-ov-subtab") || "overview";
      navigate(`/dashboard/overview/${last}`, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="space-y-6" data-testid="panel-overview">
      <nav
        className="sticky top-0 bg-white z-10 flex gap-4 mb-6 border-b"
        role="tablist"
        aria-label="Overview Sub-Tabs"
      >
        {subTabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={currentTab === tab.key}
            data-testid={tab.testid}
            className={`px-6 py-3 rounded-t font-bold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              currentTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-blue-50"
            }`}
            onClick={() => navigate(`/dashboard/overview/${tab.key}`)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="mt-4">
        <Routes>
          <Route path="overview" element={<OverviewPanel />} />
          <Route path="portfolio" element={<PortfolioPanel />} />
          <Route path="transaction" element={<TransactionPanel />} />
          <Route path="profile" element={<ProfilePanel />} />
        </Routes>
      </div>
    </div>
  );
}

import { useAdvisorClient } from "../../contexts/AdvisorClientContext";
// ...existing code...

function OverviewPanel() {
  const { clientId } = useAdvisorClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kpi, setKpi] = useState({ netWorth: 0, cashflow: 0 });
  const [alloc, setAlloc] = useState([]);
  const [txns, setTxns] = useState([]);
  const [family, setFamily] = useState([]);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    setError("");
    Promise.all([
      supabase
        .from("vw_net_worth")
        .select("net_worth")
        .eq("user_id", clientId)
        .maybeSingle(),
      supabase.from("vw_asset_allocation").select("*").eq("user_id", clientId),
      supabase
        .from("mf_transactions")
        .select("*")
        .eq("user_id", clientId)
        .order("txn_date", { ascending: false })
        .limit(5),
      supabase
        .from("family_members")
        .select("*")
        .eq("user_id", clientId)
        .limit(5),
    ])
      .then(([nw, allocRes, txnRes, famRes]) => {
        setKpi({ netWorth: nw.data?.net_worth || 0 });
        setAlloc(allocRes.data || []);
        setTxns(txnRes.data || []);
        setFamily(famRes.data || []);
      })
      .catch((err) => {
        setError("Failed to load overview");
      })
      .finally(() => setLoading(false));
  }, [clientId]);

  if (!clientId)
    return (
      <div className="p-4" data-testid="panel-ov-empty">
        Select a client to begin.
      </div>
    );
  if (loading)
    return (
      <div className="p-4" data-testid="panel-ov-loading">
        Loading…
      </div>
    );
  if (error)
    return (
      <div className="p-4 text-red-600" data-testid="panel-ov-error">
        {error}
      </div>
    );

  return (
    <div data-testid="panel-ov-overview" className="space-y-6">
      <div className="flex gap-6">
        <div className="bg-white rounded shadow p-4 flex-1">
          <div className="font-bold text-lg">Net Worth</div>
          <div className="text-2xl" data-testid="kpi-net-worth">
            {formatINR(kpi.netWorth)}
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 flex-1">
          <div className="font-bold text-lg">Asset Allocation</div>
          <ul>
            {alloc.map((a) => (
              <li key={a.category} className="flex justify-between">
                <span>{a.category}</span>
                <span>{formatINR(a.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-white rounded shadow p-4">
        <div className="font-bold mb-2">Recent Transactions</div>
        <table className="w-full text-sm" data-testid="panel-ov-txns">
          <thead>
            <tr>
              <th>Scheme</th>
              <th>Type</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {txns.map((t) => (
              <tr key={t.id}>
                <td>{t.scheme}</td>
                <td>{t.txn_type}</td>
                <td>{t.txn_date}</td>
                <td>{formatINR(t.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white rounded shadow p-4">
        <div className="font-bold mb-2">Family Members</div>
        <table className="w-full text-sm" data-testid="panel-ov-family">
          <thead>
            <tr>
              <th>Name</th>
              <th>Relation</th>
              <th>PAN</th>
              <th>DOB</th>
            </tr>
          </thead>
          <tbody>
            {family.map((f) => (
              <tr key={f.id}>
                <td>{f.name}</td>
                <td>{f.relation}</td>
                <td>{f.pan}</td>
                <td>{f.dob}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
