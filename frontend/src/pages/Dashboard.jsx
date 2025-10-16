import React, { useState, useEffect } from "react";
import {
  Loader2,
  PiggyBank,
  TrendingUp,
  Wallet,
  Trophy,
  LogOut,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Topbar from "../components/Topbar";
import SettingsModal from "../components/SettingsModal";
import UpcomingGoals from "../components/UpcomingGoals";
import AssetAllocationTrend from "../components/AssetAllocationTrend";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import { notifyError, notifySuccess } from "../utils/toast";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    netWorth: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    goalsCompleted: 0,
    totalGoals: 0,
  });
  const [profile, setProfile] = useState(null);
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [assets, setAssets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [upcomingGoals, setUpcomingGoals] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [allocationTrend, setAllocationTrend] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        // Fetch all main data
        const [profRes, incRes, expRes, astRes, goalsRes, liabRes] =
          await Promise.all([
            supabase.from("profiles").select("*").maybeSingle(),
            supabase.from("income_records").select("*"),
            supabase.from("expense_records").select("*"),
            supabase.from("assets").select("*"),
            supabase.from("goals").select("*"),
            supabase.from("liabilities").select("*"),
          ]);
        if (!mounted) return;
        if (
          profRes.error ||
          incRes.error ||
          expRes.error ||
          astRes.error ||
          goalsRes.error ||
          liabRes.error
        ) {
          throw new Error(
            profRes.error?.message ||
              incRes.error?.message ||
              expRes.error?.message ||
              astRes.error?.message ||
              goalsRes.error?.message ||
              liabRes.error?.message
          );
        }
        setProfile(profRes.data);
        setIncome(incRes.data || []);
        setExpenses(expRes.data || []);
        setAssets(astRes.data || []);
        setGoals(goalsRes.data || []);
        setLiabilities(liabRes.data || []);

        // Compute summary values safely
        const num = (n) => (Number.isFinite(n) ? n : 0);
        // Net Worth
        const totalAssets = (astRes.data || []).reduce(
          (sum, a) => sum + (a.details?.value || a.amount || 0),
          0
        );
        const totalLiabilities = (liabRes.data || []).reduce(
          (sum, l) => sum + (l.outstanding_amount || 0),
          0
        );
        const netWorth =
          profRes.data?.net_worth ?? totalAssets - totalLiabilities;
        // Monthly Income/Expenses fallback to last 30 days
        const sumLast30Days = (arr, dateField) => {
          const now = new Date();
          const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return arr
            .filter((item) => {
              const d = new Date(item[dateField]);
              return d >= cutoff && d <= now;
            })
            .reduce((sum, item) => sum + (item.amount || 0), 0);
        };
        const monthlyIncome =
          profRes.data?.monthly_income ??
          sumLast30Days(incRes.data || [], "date_received");
        const monthlyExpenses =
          profRes.data?.monthly_expenses ??
          sumLast30Days(expRes.data || [], "date_incurred");
        // Goals
        const completedGoals = (goalsRes.data || []).filter(
          (g) => g.is_completed || g.completed
        ).length;
        const totalGoals = (goalsRes.data || []).length || 1;
        setSummary({
          netWorth: num(netWorth),
          monthlyIncome: num(monthlyIncome),
          monthlyExpenses: num(monthlyExpenses),
          goalsCompleted: completedGoals,
          totalGoals,
        });

        // Fetch upcoming goals (target_date > now, is_completed = false)
        const nowISO = new Date().toISOString();
        const { data: upGoals, error: upGoalsErr } = await supabase
          .from("goals")
          .select("title, target_amount, target_date, priority")
          .gt("target_date", nowISO)
          .eq("is_completed", false)
          .order("target_date", { ascending: true });
        setUpcomingGoals(upGoals || []);

        // Asset allocation trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        const { data: assetTrend } = await supabase
          .from("assets")
          .select("amount, created_at")
          .gte("created_at", sixMonthsAgo.toISOString());
        const { data: liabTrend } = await supabase
          .from("liabilities")
          .select("outstanding_amount, created_at")
          .gte("created_at", sixMonthsAgo.toISOString());
        setAllocationTrend(
          computeAllocationTrend(assetTrend || [], liabTrend || [])
        );

        notifySuccess("Dashboard data loaded");
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
        notifyError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

  // Helper: compute allocation trend for chart
  function computeAllocationTrend(assets, liabilities) {
    const byMonth = {};
    const format = (d) => {
      const date = new Date(d);
      return date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
    };
    assets.forEach((a) => {
      const m = format(a.created_at);
      byMonth[m] = byMonth[m] || { month: m, assets: 0, liabilities: 0 };
      byMonth[m].assets += a.amount || 0;
    });
    liabilities.forEach((l) => {
      const m = format(l.created_at);
      byMonth[m] = byMonth[m] || { month: m, assets: 0, liabilities: 0 };
      byMonth[m].liabilities += l.outstanding_amount || 0;
    });
    // Sort by month (oldest to newest)
    return Object.values(byMonth).sort(
      (a, b) =>
        new Date(
          "20" + a.month.split(" ")[1],
          new Date(Date.parse(a.month.split(" ")[0] + " 1, 2000")).getMonth()
        ) -
        new Date(
          "20" + b.month.split(" ")[1],
          new Date(Date.parse(b.month.split(" ")[0] + " 1, 2000")).getMonth()
        )
    );
  }

  // Auth check: redirect to /login if not logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/login");
    });
  }, [navigate]);

  // User menu actions
  const openSettings = () => setSettingsOpen(true);
  const closeSettings = () => setSettingsOpen(false);
  const logoutUser = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Compute stats
  const totalIncome = income.reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalAssets = assets.reduce(
    (sum, a) => sum + (a.details?.value || 0),
    0
  );
  const totalLiabilities = profile?.liabilities_summary?.total || 0;
  const netWorth = profile?.net_worth || totalAssets - totalLiabilities;
  const monthlyIncome = profile?.monthly_income || totalIncome;
  const monthlyExpenses = profile?.monthly_expenses || totalExpenses;
  const completedGoals = goals.filter((g) => g.completed).length;
  const totalGoals = goals.length || 1;
  const goalCompletion = completedGoals / totalGoals;

  // Format currency
  const formatCurrency = (n) =>
    n == null
      ? "₹0"
      : `₹${(+n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  // Prepare chart data
  const last6Months = (() => {
    const arr = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      arr.push({
        month: d.toLocaleString("default", { month: "short" }),
        year: d.getFullYear(),
        key: `${d.getFullYear()}-${d.getMonth() + 1}`,
      });
    }
    return arr;
  })();
  const incomeExpenseData = last6Months.map(({ month, year, key }) => {
    const monthIncome = income
      .filter((i) => {
        if (!i.date_received) return false;
        const d = new Date(i.date_received);
        return (
          d.getFullYear() === year &&
          d.getMonth() ===
            last6Months.findIndex((m) => m.key === key) + (now.getMonth() - 5)
        );
      })
      .reduce((sum, i) => sum + (i.amount || 0), 0);
    const monthExpense = expenses
      .filter((e) => {
        if (!e.date_incurred) return false;
        const d = new Date(e.date_incurred);
        return (
          d.getFullYear() === year &&
          d.getMonth() ===
            last6Months.findIndex((m) => m.key === key) + (now.getMonth() - 5)
        );
      })
      .reduce((sum, e) => sum + (e.amount || 0), 0);
    return {
      month,
      income: monthIncome,
      expense: monthExpense,
    };
  });
  const assetData = assets.map((a, i) => ({
    name: a.type || `Asset ${i + 1}`,
    value: a.details?.value || 0,
  }));

  // Safe helpers for calculations and formatting
  const num = (n) => (Number.isFinite(n) ? n : 0);
  const fmt = (n) => `₹${num(n).toLocaleString("en-IN")}`;
  const totalSavings =
    num(summary.monthlyIncome) - num(summary.monthlyExpenses);
  const savingsRate = summary.monthlyIncome
    ? Math.max(
        0,
        Math.min(
          100,
          (1 - num(summary.monthlyExpenses) / num(summary.monthlyIncome)) * 100
        )
      )
    : 0;

  // Animate cards
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } }),
  };

  // Loading guard
  if (loading)
    return (
      <div className="py-16">
        <Loader2 className="animate-spin mx-auto text-blue-600 w-10 h-10" />
        <div className="text-center mt-4 text-gray-500">
          Loading Dashboard...
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-4 py-8">
      {/* Topbar with user info, settings, logout */}
      <Topbar
        username={profile?.full_name}
        onSettings={openSettings}
        onLogout={logoutUser}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={closeSettings}
        profile={profile}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          {
            title: "Net Worth",
            value: fmt(summary.netWorth),
            icon: <PiggyBank className="w-6 h-6 text-blue-600" />,
            color: "border-blue-600",
          },
          {
            title: "Monthly Income",
            value: fmt(summary.monthlyIncome),
            icon: <TrendingUp className="w-6 h-6 text-green-600" />,
            color: "border-green-600",
          },
          {
            title: "Monthly Expenses",
            value: fmt(summary.monthlyExpenses),
            icon: <Wallet className="w-6 h-6 text-red-500" />,
            color: "border-red-500",
          },
          {
            title: "Total Savings",
            value: fmt(totalSavings),
            icon: <Loader2 className="w-6 h-6 text-emerald-500" />,
            color: "border-emerald-500",
          },
          {
            title: "Savings Rate",
            value: `${savingsRate.toFixed(1)}%`,
            icon: <Trophy className="w-6 h-6 text-yellow-500" />,
            color: "border-yellow-500",
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card {...card} loading={loading} />
          </motion.div>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <IncomeExpenseChart data={incomeExpenseData} loading={loading} />
        <AssetAllocationTrend data={allocationTrend} loading={loading} />
      </div>

      {/* Upcoming Goals Section */}
      <UpcomingGoals goals={upcomingGoals} loading={loading} />
    </div>
  );
}
