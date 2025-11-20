import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useAuth } from "../../contexts/AuthProvider";
import { supabase } from "../../supabaseClient";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CashflowData {
  month: string;
  income?: number;
  expense?: number;
  savings?: number;
}

export default function Cashflow() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cashflowData, setCashflowData] = useState<CashflowData[]>([]);
  const [expenses, setExpenses] = useState<CashflowData[]>([]);
  const [income, setIncome] = useState<CashflowData[]>([]);

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      // Fetch income data
      const { data: incomeData, error: incomeError } = await supabase
        .from('income')
        .select('*')
        .eq('user_id', user.id)
        .order('month', { ascending: true });

      if (incomeError) throw incomeError;

      // Fetch expenses data
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('month', { ascending: true });

      if (expensesError) throw expensesError;

      // Process data to match the expected format
      const processedIncome = (incomeData || []).map((item: any) => ({
        month: item.month,
        income: item.amount,
      }));

      const processedExpenses = (expensesData || []).map((item: any) => ({
        month: item.month,
        expense: item.amount,
        category: item.category,
      }));

      // Calculate savings if needed
      const combinedData = processedIncome.map((inc: any) => ({
        month: inc.month,
        income: inc.income,
        expense: processedExpenses.find((e) => e.month === inc.month)?.expense || 0,
        savings: inc.income - (processedExpenses.find((e) => e.month === inc.month)?.expense || 0),
      }));

      setIncome(processedIncome);
      setExpenses(processedExpenses);
      setCashflowData(combinedData);
    } catch (err) {
      console.error('Error fetching cashflow data:', err);
      setError('Failed to load cashflow data');
      // Fallback to mock data in case of error
      setExpenses([
        { month: "Jan", expense: 25000 },
        { month: "Feb", expense: 22000 },
        { month: "Mar", expense: 27000 },
      ]);
      setIncome([
        { month: "Jan", income: 40000 },
        { month: "Feb", income: 42000 },
        { month: "Mar", income: 41000 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  // CRUD handlers
  const [newIncome, setNewIncome] = useState("");
  const [newExpense, setNewExpense] = useState("");
  const [newMonth, setNewMonth] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddRecord = async () => {
    if (!newMonth || !user?.id) return;

    try {
      setLoading(true);

      if (newIncome) {
        const { error } = await supabase
          .from('income')
          .upsert([
            {
              month: newMonth,
              amount: Number(newIncome),
              user_id: user.id
            }
          ]);

        if (error) throw error;
      }

      if (newExpense && newExpenseCategory) {
        const { error } = await supabase
          .from('expenses')
          .upsert([
            {
              month: newMonth,
              amount: Number(newExpense),
              category: newExpenseCategory,
              user_id: user.id
            }
          ]);

        if (error) throw error;
      }

      // Refresh data
      await fetchData();

      // Reset form
      setNewIncome("");
      setNewExpense("");
      setNewExpenseCategory("");
      setNewMonth("");

    } catch (error) {
      console.error('Error adding record:', error);
      setError('Failed to add record');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (month: string, kind: 'income' | 'expense', category?: string) => {
    if (!user?.id) return;
    try {
      setLoading(true);
      if (kind === 'income') {
        const { error } = await supabase
          .from('income')
          .delete()
          .eq('user_id', user.id)
          .eq('month', month);
        if (error) throw error;
      } else {
        let query = supabase
          .from('expenses')
          .delete()
          .eq('user_id', user.id)
          .eq('month', month);
        if (category) query = query.eq('category', category);
        const { error } = await query;
        if (error) throw error;
      }
      await fetchData();
    } catch (err) {
      console.error('Error deleting record:', err);
      setError('Failed to delete record');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = (idx) => {
    setExpenses(expenses.filter((_, i) => i !== idx));
  };

  // Chart data
  const months = Array.from(
    new Set([...income.map((i) => i.month), ...expenses.map((e) => e.month)])
  );
  const chartData = {
    labels: Array.from(new Set([...income.map(i => i.month), ...expenses.map(e => e.month)])).sort(),
    datasets: [
      {
        label: 'Income',
        data: income.map(i => i.income || 0),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: expenses.map(e => e.expense || 0),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return <div className="p-4">Loading cashflow data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold text-gray-800">Cashflow Management</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
          <p className="text-2xl font-semibold text-green-600">
            ₹{income.reduce((sum, item) => sum + (item.income || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
          <p className="text-2xl font-semibold text-red-600">
            ₹{expenses.reduce((sum, item) => sum + (item.expense || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Net Savings</h3>
          <p className="text-2xl font-semibold text-blue-600">
            ₹{(
              income.reduce((sum, item) => sum + (item.income || 0), 0) -
              expenses.reduce((sum, item) => sum + (item.expense || 0), 0)
            ).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Add Record Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Add/Update Record</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <input
              type="month"
              value={newMonth}
              onChange={(e) => setNewMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Income (₹)</label>
            <input
              type="number"
              value={newIncome}
              onChange={(e) => setNewIncome(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expense (₹)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={newExpense}
                onChange={(e) => setNewExpense(e.target.value)}
                placeholder="0"
                min="0"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={newExpenseCategory}
                onChange={(e) => setNewExpenseCategory(e.target.value)}
                className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!newExpense}
              >
                <option value="">Category</option>
                <option value="Housing">Housing</option>
                <option value="Food">Food</option>
                <option value="Transportation">Transportation</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddRecord}
              disabled={!newMonth || (!newIncome && (!newExpense || !newExpenseCategory))}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {editingId ? 'Update' : 'Add'} Record
            </button>
          </div>
        </div>
      </div>

      {/* Income vs Expenses Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
        <div className="h-64">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `₹${value}`,
                  },
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      return `₹${context.raw.toLocaleString()}`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Income Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Income</h3>
          <span className="text-sm text-gray-500">{income.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {income.length > 0 ? (
                income.map((item) => (
                  <tr key={`income-${item.month}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(`${item.month}-01`).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      ₹{item.income?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteRecord(item.month, 'income')}
                        className="text-red-600 hover:text-red-900 mr-4"
                        title="Delete"
                      >
                        <Trash2 size={16} className="inline" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No income records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Expenses</h3>
          <span className="text-sm text-gray-500">{expenses.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.length > 0 ? (
                expenses.map((item) => (
                  <tr key={`expense-${item.month}-${item.category}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(`${item.month}-01`).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      ₹{item.expense?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteRecord(item.month, 'expense', item.category as any)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 size={16} className="inline" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No expense records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
