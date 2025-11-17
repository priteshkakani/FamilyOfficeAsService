import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PortfolioPanel from "./Portfolio";
import TransactionPanel from "./Transaction";
import ProfilePanel from "./Profile";
import formatINR from "../../utils/formatINR";
// import { useClient } from "../../hooks/useClientContext";
import useClientData from "../../hooks/useClientData";

export default function Overview() {
  // Tab config
  const tabs = [
    { key: "feeds", label: "All Feeds", testid: "tab-feeds" },
    { key: "portfolio", label: "Portfolio", testid: "tab-portfolio" },
    { key: "transactions", label: "Transactions", testid: "tab-transactions" },
    { key: "profile", label: "Profile", testid: "tab-profile" },
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const currentTab = params.get("tab") || "feeds";

  // Tab badge counts (optional, mock for now)
  const [counts, setCounts] = React.useState({
    feeds: 2,
    portfolio: 5,
    transactions: 3,
    profile: 0,
  });

  // Keyboard navigation
  const tabRefs = React.useRef([]);
  const handleKeyDown = (e) => {
    const idx = tabs.findIndex((t) => t.key === currentTab);
    if (e.key === "ArrowRight") {
      const next = (idx + 1) % tabs.length;
      tabRefs.current[next]?.focus();
      navigate(`?tab=${tabs[next].key}`);
    } else if (e.key === "ArrowLeft") {
      const prev = (idx - 1 + tabs.length) % tabs.length;
      tabRefs.current[prev]?.focus();
      navigate(`?tab=${tabs[prev].key}`);
    } else if (e.key === "Home") {
      tabRefs.current[0]?.focus();
      navigate(`?tab=${tabs[0].key}`);
    } else if (e.key === "End") {
      tabRefs.current[tabs.length - 1]?.focus();
      navigate(`?tab=${tabs[tabs.length - 1].key}`);
    }
  };

  // Responsive tab bar
  return (
    <div className="space-y-6" data-testid="panel-overview">
      <nav
        className="sticky top-0 bg-white z-10 flex overflow-x-auto gap-2 mb-6 border-b"
        role="tablist"
        aria-label="Overview Tabs"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.key}
            ref={(el) => (tabRefs.current[i] = el)}
            role="tab"
            aria-selected={currentTab === tab.key}
            aria-controls={`tabpanel-${tab.key}`}
            tabIndex={currentTab === tab.key ? 0 : -1}
            data-testid={tab.testid}
            className={`px-4 py-2 rounded-t font-bold text-base whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              currentTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-blue-50"
            }`}
            onClick={() => navigate(`?tab=${tab.key}`)}
            onKeyDown={handleKeyDown}
          >
            {tab.label}
            {counts[tab.key] > 0 && (
              <span
                className="ml-2 bg-blue-100 text-blue-700 rounded-full px-2 text-xs align-middle"
                data-testid={`badge-${tab.key}`}
              >
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="mt-4">
        <TabPanels currentTab={currentTab} />
      </div>
    </div>
  );
  // TabPanels component renders content for each tab
  function TabPanels({ currentTab }) {
    // Loading, error, and empty states can be customized per tab
    switch (currentTab) {
      case "feeds":
        return <FeedsPanel />;
      case "portfolio":
        return <PortfolioPanel />;
      case "transactions":
        return <TransactionPanel />;
      case "profile":
        return <ProfilePanel />;
      default:
        return <FeedsPanel />;
    }
  }

  // Example FeedsPanel (replace with real feed logic)
  function FeedsPanel() {
    // Simulate loading/error/empty states
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [feeds, setFeeds] = React.useState([]);
    React.useEffect(() => {
      setLoading(true);
      setTimeout(() => {
        setFeeds([
          { id: 1, title: "Welcome!" },
          { id: 2, title: "Portfolio updated" },
        ]);
        setLoading(false);
      }, 500);
    }, []);
    if (loading) return <div className="p-4">Loading feeds…</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;
    if (!feeds.length)
      return <div className="p-4 text-gray-500">No feed items.</div>;
    return (
      <div className="p-4" id="tabpanel-feeds" role="tabpanel" tabIndex={0}>
        <h2 className="text-lg font-semibold mb-4">All Feeds</h2>
        <ul className="space-y-2">
          {feeds.map((f) => (
            <li key={f.id} className="bg-white rounded shadow p-3">
              {f.title}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

function OverviewPanel() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kpi, setKpi] = useState({ netWorth: 0, cashflow: 0 });
  const [alloc, setAlloc] = useState([]);
  const [txns, setTxns] = useState([]);
  const [family, setFamily] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    
    setLoading(true);
    setError("");
    setLoading(true);
    setError("");
    Promise.all([
      supabase
        .from("vw_net_worth")
        .select("net_worth")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase.from("vw_asset_allocation").select("*").eq("user_id", user.id),
      supabase
        .from("mf_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("txn_date", { ascending: false })
        .limit(5),
      supabase
        .from("family_members")
        .select("*")
        .eq("user_id", user.id)
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

  if (!user?.id)
    return (
      <div className="p-4" data-testid="panel-ov-empty">
        Please sign in to view your overview.
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
