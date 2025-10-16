import React, { useState, useEffect } from "react";
import { Loader2, PiggyBank, TrendingUp, Wallet, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import Card from "../components/Card";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import AssetAllocationChart from "../components/AssetAllocationChart";
import { notifyError, notifySuccess } from "../utils/toast";

export default function Dashboard() {
  // Safely initialized summary state
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [profRes, incRes, expRes, astRes, goalsRes] = await Promise.all([
          supabase.from("profiles").select("*").maybeSingle(),
          supabase.from("income_records").select("*"),
          supabase.from("expense_records").select("*"),
          supabase.from("assets").select("*"),
          supabase.from("goals").select("*"),
        ]);
        if (!mounted) return;
        if (
          profRes.error ||
          incRes.error ||
          expRes.error ||
          astRes.error ||
          goalsRes.error
        ) {
          throw new Error(
            profRes.error?.message ||
              incRes.error?.message ||
              expRes.error?.message ||
              astRes.error?.message ||
              goalsRes.error?.message
          );
        }
        setProfile(profRes.data);
        setIncome(incRes.data || []);
        setExpenses(expRes.data || []);
        setAssets(astRes.data || []);
        setGoals(goalsRes.data || []);

        // Compute summary values safely
        const num = (n) => (Number.isFinite(n) ? n : 0);
        // Net Worth
        const totalAssets = (astRes.data || []).reduce(
          (sum, a) => sum + (a.details?.value || 0),
          0
        );
        const totalLiabilities = profRes.data?.liabilities_summary?.total || 0;
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
      {/* Gradient Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div className="text-lg md:text-2xl font-semibold">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""} 👋
          </div>
          <div className="text-sm text-blue-100 mt-1">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <div className="text-sm text-blue-100 mt-2 md:mt-0">
          {profile?.email}
        </div>
      </motion.div>

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <IncomeExpenseChart data={incomeExpenseData} loading={loading} />
        <AssetAllocationChart data={assetData} loading={loading} />
      </div>

      {/* Optional: Recent Transactions or Upcoming Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Transactions
          </h2>
          {loading ? (
            <div className="h-24 animate-pulse bg-gray-100 rounded" />
          ) : (
            <ul className="divide-y divide-gray-100">
              {[...income.slice(0, 3), ...expenses.slice(0, 3)]
                .sort((a, b) => {
                  const da = new Date(a.date_received || a.date_incurred);
                  const db = new Date(b.date_received || b.date_incurred);
                  return db - da;
                })
                .slice(0, 5)
                .map((tx, idx) => (
                  <li
                    key={idx}
                    className="py-2 flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-700">
                      {tx.source || tx.category || "Transaction"}
                    </span>
                    <span
                      className={
                        tx.amount >= 0
                          ? tx.date_received
                            ? "text-green-600"
                            : "text-red-600"
                          : "text-gray-600"
                      }
                    >
                      {tx.date_received ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Upcoming Goals
          </h2>
          {loading ? (
            <div className="h-24 animate-pulse bg-gray-100 rounded" />
          ) : (
            <ul className="divide-y divide-gray-100">
              {goals
                .filter((g) => !g.completed)
                .slice(0, 5)
                .map((g, idx) => (
                  <li
                    key={idx}
                    className="py-2 flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-700">
                      {g.title || "Goal"}
                    </span>
                    <span className="text-gray-500 text-xs">
                      Due:{" "}
                      {g.due_date
                        ? new Date(g.due_date).toLocaleDateString()
                        : "-"}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
