import supabase from "../../supabaseClient";
import GoalsTab from "./GoalsTab";
import { useAuth } from "../../contexts/AuthProvider";

// --- AddInsuranceModal ---
function AddInsuranceModal({ open, onClose, clientId }) {
  const [form, setForm] = React.useState({
    policy_type: "Health",
    insurer: "",
    policy_no: "",
    start_date: "",
    end_date: "",
    annual_premium: "",
    sum_assured: "",
    nominee: "",
    notes: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [touched, setTouched] = React.useState({});
  const [success, setSuccess] = React.useState(false);

  if (!open) return null;

  const required = {
    insurer: !!form.insurer,
    annual_premium:
      form.annual_premium !== "" && Number(form.annual_premium) >= 0,
    sum_assured: form.sum_assured !== "" && Number(form.sum_assured) >= 0,
    start_date: !!form.start_date,
    end_date: !!form.end_date,
  };
  const isValid = Object.values(required).every(Boolean);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!isValid) return;
    setLoading(true);
    try {
      // TODO: Replace with actual Supabase insert logic
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setForm({
        policy_type: "Health",
        insurer: "",
        policy_no: "",
        start_date: "",
        end_date: "",
        annual_premium: "",
        sum_assured: "",
        nominee: "",
        notes: "",
      });
      onClose();
    } catch (err) {
      setError(err.message || "Error adding insurance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative"
        role="dialog"
        aria-modal="true"
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Add Insurance</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">
              Insurer <span className="text-red-500">*</span>
            </label>
            <input
              name="insurer"
              value={form.insurer}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
            {!required.insurer && touched.insurer && (
              <div className="text-red-500 text-xs">Required</div>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                required
              />
              {!required.start_date && touched.start_date && (
                <div className="text-red-500 text-xs">Required</div>
              )}
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                required
              />
              {!required.end_date && touched.end_date && (
                <div className="text-red-500 text-xs">Required</div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Annual Premium <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                name="annual_premium"
                value={form.annual_premium}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                required
              />
              {!required.annual_premium && touched.annual_premium && (
                <div className="text-red-500 text-xs">
                  Required, must be ≥ 0
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Sum Assured <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                name="sum_assured"
                value={form.sum_assured}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                required
              />
              {!required.sum_assured && touched.sum_assured && (
                <div className="text-red-500 text-xs">
                  Required, must be ≥ 0
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Policy No</label>
            <input
              name="policy_no"
              value={form.policy_no}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Nominee</label>
            <input
              name="nominee"
              value={form.nominee}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 min-h-[60px]"
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && (
            <div className="text-green-600 text-sm">Insurance added!</div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded border"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold disabled:opacity-50"
              disabled={!isValid || loading}
            >
              {loading ? "Saving..." : "Add Insurance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  function DashboardHeader({
    loading,
    error,
    clientName,
    advisorName,
    updatedAt,
  }) {
    return (
      <header className="sticky top-0 z-10 bg-white pt-2 pb-3 mb-4">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-7 w-48 bg-gray-200 rounded mb-1" />
            <div className="h-4 w-32 bg-gray-100 rounded" />
          </div>
        ) : error ? (
          <div className="text-red-600 text-sm">{error}</div>
        ) : (
          <div className="flex flex-col items-start">
            <span className="text-2xl font-semibold text-gray-900 leading-tight">
              {clientName || "Client"}
            </span>
            <span className="text-sm text-gray-500 italic mt-0.5">
              {/* No advisorName in Client Mode */}
            </span>
            {updatedAt && (
              <span className="text-xs text-gray-400 mt-1">
                Last updated: {new Date(updatedAt).toLocaleString()}
              </span>
            )}
          </div>
        )}
      </header>
    );
  }
  // AddGoalModal will be defined below
  // removed duplicate useRef and useState imports
  // import hooks for KPIs, assets, liabilities, insurance, etc. as needed

  const subTabs = [
    { key: "summary", label: "Summary", testid: "subtab-portfolio-summary" },
    { key: "assets", label: "Assets", testid: "subtab-portfolio-assets" },
    {
      key: "liabilities",
      label: "Liabilities",
      testid: "subtab-portfolio-liabilities",
    },
    {
      key: "insurance",
      label: "Insurance",
      testid: "subtab-portfolio-insurance",
    },
    {
      key: "analytics",
      label: "Analytics",
      testid: "subtab-portfolio-analytics",
    },
  ];

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddInsurance, setShowAddInsurance] = useState(false);
  const { user, profile, authLoading, profileLoading } = useAuth();
  const userId = user?.id;
  const [headerLoading, setHeaderLoading] = useState(true);
  const [headerError, setHeaderError] = useState("");
  const [clientName, setClientName] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  useEffect(() => {
    if (!userId) {
      setClientName("");
      setUpdatedAt("");
      setHeaderLoading(authLoading);
      setHeaderError(authLoading ? "" : "User not found");
      return;
    }
    setHeaderLoading(true);
    setHeaderError("");
    (async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, updated_at")
          .eq("id", userId)
          .single();
        if (error || !data) throw error || new Error("User not found");
        setClientName(data.full_name || "");
        setUpdatedAt(data.updated_at || "");
      } catch (err) {
        setClientName("");
        setUpdatedAt("");
        setHeaderError(err?.message || "Error loading user info");
      } finally {
        setHeaderLoading(false);
      }
    })();
  }, [userId, authLoading]);

  // Insurance
  const {
    data: insurance = [],
    isLoading: insuranceLoading,
    refetch: refetchInsurance,
  } = useQuery({
    queryKey: ["insurance", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("insurance_policies")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
  const [activeTab, setActiveTab] = useState("summary");
  // Assets filters
  const [assetSearch, setAssetSearch] = useState("");
  const [assetCategory, setAssetCategory] = useState("");
  const [assetFrom, setAssetFrom] = useState("");
  const [assetTo, setAssetTo] = useState("");
  // Liabilities filters
  const [liabSearch, setLiabSearch] = useState("");
  const [liabType, setLiabType] = useState("");
  const [liabFrom, setLiabFrom] = useState("");
  const [liabTo, setLiabTo] = useState("");
  // Insurance filters
  const [insSearch, setInsSearch] = useState("");
  const [insType, setInsType] = useState("");
  const [insFrom, setInsFrom] = useState("");
  const [insTo, setInsTo] = useState("");
  // Debounce search
  const assetSearchRef = useRef();
  const liabSearchRef = useRef();
  const insSearchRef = useRef();
  useEffect(() => {
    assetSearchRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("q", assetSearch);
      if (assetCategory) params.set("cat", assetCategory);
      else params.delete("cat");
      if (assetFrom) params.set("from", assetFrom);
      else params.delete("from");
      if (assetTo) params.set("to", assetTo);
      else params.delete("to");
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${params}`
      );
    }, 400);
    return () => clearTimeout(assetSearchRef.current);
  }, [assetSearch, assetCategory, assetFrom, assetTo]);
  useEffect(() => {
    liabSearchRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("liab_q", liabSearch);
      if (liabType) params.set("liab_type", liabType);
      else params.delete("liab_type");
      if (liabFrom) params.set("liab_from", liabFrom);
      else params.delete("liab_from");
      if (liabTo) params.set("liab_to", liabTo);
      else params.delete("liab_to");
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${params}`
      );
    }, 400);
    return () => clearTimeout(liabSearchRef.current);
  }, [liabSearch, liabType, liabFrom, liabTo]);
  useEffect(() => {
    insSearchRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("ins_q", insSearch);
      if (insType) params.set("ins_type", insType);
      else params.delete("ins_type");
      if (insFrom) params.set("ins_from", insFrom);
      else params.delete("ins_from");
      if (insTo) params.set("ins_to", insTo);
      else params.delete("ins_to");
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${params}`
      );
    }, 400);
    return () => clearTimeout(insSearchRef.current);
  }, [insSearch, insType, insFrom, insTo]);

  // Assets
  const {
    data: assets = [],
    isLoading: assetsLoading,
    refetch: refetchAssets,
  } = useQuery({
    queryKey: ["assets", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  // Analytics (asset allocation, liability breakdown, net worth)
  const {
    data: analytics = {},
    isLoading: analyticsLoading,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ["analytics", userId],
    queryFn: async () => {
      if (!userId) return {};
      const [alloc, liab, net] = await Promise.all([
        supabase.from("vw_asset_allocation").select("*").eq("user_id", userId),
        supabase
          .from("vw_liability_breakdown")
          .select("*")
          .eq("user_id", userId),
        supabase
          .from("vw_net_worth")
          .select("*")
          .eq("user_id", userId)
          .single(),
      ]);
      return {
        allocation: alloc.data || [],
        liability: liab.data || [],
        netWorth: net.data || {},
      };
    },
    enabled: !!userId,
  });

  return (
    <div data-testid="nav-portfolio" className="p-4">
      <DashboardHeader
        loading={headerLoading}
        error={headerError}
        clientName={clientName}
        updatedAt={updatedAt}
      />
      {/* PLAN SECTION */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Plan</h2>
        <div className="flex gap-4 border-b mb-6">
          {["Summary", "Cash Flows", "Insurance", "Goals"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 -mb-px border-b-2 font-semibold transition-colors duration-150 ${
                activeTab === tab.toLowerCase()
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab(tab.toLowerCase())}
              role="tab"
              aria-selected={activeTab === tab.toLowerCase()}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      {activeTab === "summary" && (
        <div className="p-4 bg-white rounded-xl shadow mb-4">
          Summary content (KPIs, overview, etc.)
        </div>
      )}
      {activeTab === "cash flows" && (
        <div className="p-4 bg-white rounded-xl shadow mb-4">
          Cash Flows content (income, expenses, trends, etc.)
        </div>
      )}
      {activeTab === "insurance" && userId && (
        <div className="p-4 bg-white rounded-xl shadow mb-4">
          Insurance content (policies, coverage, renewals, etc.)
        </div>
      )}
      {activeTab === "goals" && userId && (
        <React.Fragment>
          <div className="flex justify-end mb-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded font-semibold shadow hover:bg-blue-700 transition"
              onClick={() => setShowAddGoal(true)}
              data-testid="add-goal-btn"
            >
              Add Goal
            </button>
          </div>
          <AddGoalModal
            open={showAddGoal}
            onClose={() => setShowAddGoal(false)}
            clientId={userId}
          />
          <GoalsTab clientId={userId} />
        </React.Fragment>
      )}
      {/* Assets Tab */}
      {activeTab === "assets" && userId && (
        <div data-testid="subtab-portfolio-assets">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search assets"
              className="border px-2 py-1 rounded"
              data-testid="filter-q"
              value={assetSearch}
              onChange={(e) => setAssetSearch(e.target.value)}
            />
            <div className="flex gap-1">
              {["equity", "debt", "real_estate", "gold", "cash", "other"].map(
                (cat) => (
                  <button
                    key={cat}
                    className={`px-2 py-1 rounded ${
                      assetCategory === cat
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                    data-testid="filter-category"
                    onClick={() =>
                      setAssetCategory(cat === assetCategory ? "" : cat)
                    }
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
            <input
              type="date"
              className="border px-2 py-1 rounded"
              data-testid="filter-from"
              value={assetFrom}
              onChange={(e) => setAssetFrom(e.target.value)}
            />
            <input
              type="date"
              className="border px-2 py-1 rounded"
              data-testid="filter-to"
              value={assetTo}
              onChange={(e) => setAssetTo(e.target.value)}
            />
          </div>
          {assetsLoading ? (
            <div>Loading assets…</div>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="min-w-full bg-white rounded-xl shadow"
                data-testid="assets-table"
              >
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">As of Date</th>
                    <th className="px-4 py-2 text-left">Metadata</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets
                    .filter(
                      (a) =>
                        (!assetSearch ||
                          a.name
                            ?.toLowerCase()
                            .includes(assetSearch.toLowerCase())) &&
                        (!assetCategory || a.category === assetCategory) &&
                        (!assetFrom ||
                          new Date(a.as_of_date) >= new Date(assetFrom)) &&
                        (!assetTo ||
                          new Date(a.as_of_date) <= new Date(assetTo))
                    )
                    .map((asset) => (
                      <tr key={asset.id}>
                        <td className="px-4 py-2">{asset.name}</td>
                        <td className="px-4 py-2">{asset.category}</td>
                        <td className="px-4 py-2">{asset.amount}</td>
                        <td className="px-4 py-2">{asset.as_of_date}</td>
                        <td className="px-4 py-2">
                          {JSON.stringify(asset.metadata)}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <button
                              className="text-blue-600 hover:underline"
                              data-testid="action-view"
                            >
                              View
                            </button>
                            <button
                              className="text-yellow-600 hover:underline"
                              data-testid="action-edit"
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-600 hover:underline"
                              data-testid="action-delete"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {assets.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-gray-500 text-center py-4"
                      >
                        No assets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* End of assets tab */}
      {/* Liabilities Tab */}
      {activeTab === "liabilities" && userId && (
        <div data-testid="subtab-portfolio-liabilities">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search liabilities"
              className="border px-2 py-1 rounded"
              data-testid="filter-q"
              value={liabSearch}
              onChange={(e) => setLiabSearch(e.target.value)}
            />
            <div className="flex gap-1">
              {[
                "home",
                "mortgage",
                "vehicle",
                "education",
                "personal",
                "credit_card",
                "other",
                "las",
              ].map((type) => (
                <button
                  key={type}
                  className={`px-2 py-1 rounded ${
                    liabType === type ? "bg-blue-500 text-white" : "bg-gray-100"
                  }`}
                  data-testid="filter-category"
                  onClick={() => setLiabType(type === liabType ? "" : type)}
                >
                  {type}
                </button>
              ))}
            </div>
            <input
              type="date"
              className="border px-2 py-1 rounded"
              data-testid="filter-from"
              value={liabFrom}
              onChange={(e) => setLiabFrom(e.target.value)}
            />
            <input
              type="date"
              className="border px-2 py-1 rounded"
              data-testid="filter-to"
              value={liabTo}
              onChange={(e) => setLiabTo(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table
              className="min-w-full bg-white rounded-xl shadow"
              data-testid="liabilities-table"
            >
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Institution</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Total Amount</th>
                  <th className="px-4 py-2 text-left">Outstanding</th>
                  <th className="px-4 py-2 text-left">EMI</th>
                  <th className="px-4 py-2 text-left">Interest Rate</th>
                  <th className="px-4 py-2 text-left">Schedule</th>
                  <th className="px-4 py-2 text-left">Remaining EMIs</th>
                  <th className="px-4 py-2 text-left">EMI Date</th>
                  <th className="px-4 py-2 text-left">As of Date</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {liabilities
                  .filter(
                    (l) =>
                      (!liabSearch ||
                        l.institution
                          ?.toLowerCase()
                          .includes(liabSearch.toLowerCase()) ||
                        l.type
                          ?.toLowerCase()
                          .includes(liabSearch.toLowerCase())) &&
                      (!liabType || l.type === liabType) &&
                      (!liabFrom ||
                        new Date(l.as_of_date) >= new Date(liabFrom)) &&
                      (!liabTo || new Date(l.as_of_date) <= new Date(liabTo))
                  )
                  .map((liab) => (
                    <tr key={liab.id}>
                      <td className="px-4 py-2">{liab.institution}</td>
                      <td className="px-4 py-2">{liab.type}</td>
                      <td className="px-4 py-2">{liab.total_amount}</td>
                      <td className="px-4 py-2">{liab.outstanding_amount}</td>
                      <td className="px-4 py-2">{liab.emi}</td>
                      <td className="px-4 py-2">{liab.interest_rate}</td>
                      <td className="px-4 py-2">{liab.schedule}</td>
                      <td className="px-4 py-2">{liab.remaining_emis}</td>
                      <td className="px-4 py-2">{liab.emi_date}</td>
                      <td className="px-4 py-2">{liab.as_of_date}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            className="text-blue-600 hover:underline"
                            data-testid="action-view"
                          >
                            View
                          </button>
                          <button
                            className="text-yellow-600 hover:underline"
                            data-testid="action-edit"
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:underline"
                            data-testid="action-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {liabilities.length === 0 && (
                  <tr>
                    <td colSpan={11} className="text-gray-500 text-center py-4">
                      No liabilities found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Insurance Tab */}
      {activeTab === "insurance" && (
        <div data-testid="subtab-portfolio-insurance">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search insurance"
                className="border px-2 py-1 rounded"
                data-testid="filter-q"
                value={insSearch}
                onChange={(e) => setInsSearch(e.target.value)}
              />
              <div className="flex gap-1">
                {[
                  "Health",
                  "Personal Accident",
                  "Critical Illness",
                  "Motor",
                  "Travel",
                  "Home",
                  "Term",
                  "ULIPs",
                  "Other",
                ].map((type) => (
                  <button
                    key={type}
                    className={`px-2 py-1 rounded ${
                      insType === type
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                    data-testid="filter-category"
                    onClick={() => setInsType(type === insType ? "" : type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <input
                type="date"
                className="border px-2 py-1 rounded"
                data-testid="filter-from"
                value={insFrom}
                onChange={(e) => setInsFrom(e.target.value)}
              />
              <input
                type="date"
                className="border px-2 py-1 rounded"
                data-testid="filter-to"
                value={insTo}
                onChange={(e) => setInsTo(e.target.value)}
              />
            </div>
            <button
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded font-semibold shadow hover:bg-blue-700 transition"
              onClick={() => setShowAddInsurance(true)}
              data-testid="add-insurance-btn"
            >
              Add Insurance
            </button>
          </div>
          <AddInsuranceModal
            open={showAddInsurance}
            onClose={() => setShowAddInsurance(false)}
            clientId={client_id}
          />
          {insuranceLoading ? (
            <div>Loading insurance…</div>
          ) : (
            <div className="overflow-x-auto mb-6">
              <table
                className="min-w-full bg-white rounded-xl shadow"
                data-testid="insurance-table"
              >
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Provider</th>
                    <th className="px-4 py-2 text-left">Policy No</th>
                    <th className="px-4 py-2 text-left">Sum Assured</th>
                    <th className="px-4 py-2 text-left">Premium</th>
                    <th className="px-4 py-2 text-left">Frequency</th>
                    <th className="px-4 py-2 text-left">Start Date</th>
                    <th className="px-4 py-2 text-left">End Date</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {insurance
                    .filter(
                      (p) =>
                        (!insSearch ||
                          p.provider
                            ?.toLowerCase()
                            .includes(insSearch.toLowerCase()) ||
                          p.policy_no
                            ?.toLowerCase()
                            .includes(insSearch.toLowerCase()) ||
                          p.type
                            ?.toLowerCase()
                            .includes(insSearch.toLowerCase())) &&
                        (!insType || p.type === insType) &&
                        (!insFrom ||
                          new Date(p.start_date) >= new Date(insFrom)) &&
                        (!insTo || new Date(p.end_date) <= new Date(insTo))
                    )
                    .map((policy) => (
                      <tr key={policy.id}>
                        <td className="px-4 py-2">{policy.provider}</td>
                        <td className="px-4 py-2">{policy.policy_no}</td>
                        <td className="px-4 py-2">{policy.sum_assured}</td>
                        <td className="px-4 py-2">{policy.premium}</td>
                        <td className="px-4 py-2">{policy.premium_freq}</td>
                        <td className="px-4 py-2">{policy.start_date}</td>
                        <td className="px-4 py-2">{policy.end_date}</td>
                        <td className="px-4 py-2">{policy.status}</td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <button
                              className="text-blue-600 hover:underline"
                              data-testid="action-view"
                            >
                              View
                            </button>
                            <button
                              className="text-yellow-600 hover:underline"
                              data-testid="action-edit"
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-600 hover:underline"
                              data-testid="action-delete"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {insurance.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-gray-500 text-center py-4"
                      >
                        No insurance policies found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {/* End of insurance tab */}
          {/* Renewals list (end_date ascending) */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="font-semibold mb-2">Upcoming Renewals</div>
            <ul className="list-disc pl-6">
              {insurance
                .filter((p) => p.end_date)
                .sort((a, b) => new Date(a.end_date) - new Date(b.end_date))
                .slice(0, 5)
                .map((p) => (
                  <li key={p.id}>
                    {p.provider} - End Date: {p.end_date}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div data-testid="subtab-portfolio-analytics">
          {/* Example: Add filter/search for analytics export */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search analytics"
              className="border px-2 py-1 rounded"
              data-testid="filter-q"
              // value and onChange can be wired to analytics search/filter state if needed
            />
            <input
              type="date"
              className="border px-2 py-1 rounded"
              data-testid="filter-from"
              // value and onChange can be wired to analytics filter state if needed
            />
            <input
              type="date"
              className="border px-2 py-1 rounded"
              data-testid="filter-to"
              // value and onChange can be wired to analytics filter state if needed
            />
          </div>
          {analyticsLoading ? (
            <div>Loading analytics…</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow p-4">
                <div className="font-semibold mb-2">Asset Allocation</div>
                {/* Donut chart placeholder */}
                <div className="h-32 flex items-center justify-center">
                  {Array.isArray(analytics.allocation) &&
                  analytics.allocation.length
                    ? "Donut Chart"
                    : "No data"}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <div className="font-semibold mb-2">Liability Breakdown</div>
                {/* Bar chart placeholder */}
                <div className="h-32 flex items-center justify-center">
                  {Array.isArray(analytics.liability) &&
                  analytics.liability.length
                    ? "Bar Chart"
                    : "No data"}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <div className="font-semibold mb-2">Net Worth Over Time</div>
                {/* Line chart placeholder */}
                <div className="h-32 flex items-center justify-center">
                  {analytics.netWorth ? "Line Chart" : "No data"}
                </div>
              </div>
            </div>
          )}
          {/* End of analytics tab */}
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            data-testid="btn-export-csv"
          >
            Export CSV
          </button>
        </div>
      )}
    </div>
  );
}
