import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import DataTable from "../../components/dashboard/DataTable";
import { supabase } from "../../supabaseClient";
import { Plus, MoreVertical, X, Save, Trash2 } from 'lucide-react';

interface Liability {
  id?: string;
  type: string;
  institution: string;
  total_amount: string;
  outstanding_amount: string;
  emi_amount: string;
  interest_rate: string;
  schedule: string;
  remaining_emis: string;
  emi_date: string;
  as_of_date: string;
  user_id?: string;
}

const Liabilities: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [rows, setRows] = useState<Liability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<Liability | null>(null);
  const [form, setForm] = useState<Omit<Liability, 'id' | 'user_id'>>({
    type: "",
    institution: "",
    total_amount: "",
    outstanding_amount: "",
    emi_amount: "",
    interest_rate: "",
    schedule: "",
    remaining_emis: "",
    emi_date: "",
    as_of_date: "",
  });
  
  const pageSize = 10;
  
  // Fetch liabilities for the current user
  useEffect(() => {
    const fetchLiabilities = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('liabilities')
          .select('*')
          .eq('user_id', userId)
          .order('as_of_date', { ascending: false });
          
        if (error) throw error;
        setRows(data || []);
      } catch (err) {
        console.error('Error fetching liabilities:', err);
        setError('Failed to load liabilities');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLiabilities();
  }, [userId]);
  
  // Handle delete liability
  const handleDelete = async (id: string) => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this liability?')) {
      return;
    }
    
    const prevRows = [...rows];
    try {
      setRows(prev => prev.filter(row => row.id !== id));
      
      const { error } = await supabase
        .from('liabilities')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
        
      if (error) throw error;
    } catch (err) {
      console.error('Error deleting liability:', err);
      setRows(prevRows);
      setError('Failed to delete liability');
    }
  };
  
  // Handle edit liability
  const handleEdit = (row: Liability) => {
    setEditRow(row);
    setForm({
      type: row.type || "",
      institution: row.institution || "",
      total_amount: row.total_amount || "",
      outstanding_amount: row.outstanding_amount || "",
      emi_amount: row.emi_amount || "",
      interest_rate: row.interest_rate || "",
      schedule: row.schedule || "",
      remaining_emis: row.remaining_emis || "",
      emi_date: row.emi_date || "",
      as_of_date: row.as_of_date || "",
    });
  };
  
  // Handle save liability
  const handleSave = async () => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }
    
    setError('');
    const payload = { ...form, user_id: userId };
    
    try {
      if (editRow?.id) {
        // Update existing liability
        const { error } = await supabase
          .from('liabilities')
          .update(payload)
          .eq('id', editRow.id)
          .eq('user_id', userId);
          
        if (error) throw error;
      } else {
        // Create new liability
        const { error } = await supabase
          .from('liabilities')
          .insert([payload]);
          
        if (error) throw error;
      }
      
      // Refresh the list
      const { data, error } = await supabase
        .from('liabilities')
        .select('*')
        .eq('user_id', userId)
        .order('as_of_date', { ascending: false });
        
      if (error) throw error;
      
      setRows(data || []);
      setEditRow(null);
      setForm({
        type: "",
        institution: "",
        total_amount: "",
        outstanding_amount: "",
        emi_amount: "",
        interest_rate: "",
        schedule: "",
        remaining_emis: "",
        emi_date: "",
        as_of_date: "",
      });
    } catch (err) {
      console.error('Error saving liability:', err);
      setError('Failed to save liability');
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  // Pagination
  const pagedRows = rows.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(rows.length / pageSize);

  const columns = [
    { key: "type", title: "Type" },
    { key: "institution", title: "Institution" },
    {
      key: "total_amount",
      title: "Total Amount",
      render: (r: Liability) => `₹${Number(r.total_amount || 0).toLocaleString("en-IN")}`,
    },
    {
      key: "outstanding_amount",
      title: "Outstanding",
      render: (r: Liability) => `₹${Number(r.outstanding_amount || 0).toLocaleString("en-IN")}`,
    },
    {
      key: "emi_amount",
      title: "EMI",
      render: (r: Liability) => `₹${Number(r.emi_amount || 0).toLocaleString("en-IN")}`,
    },
    { 
      key: "interest_rate", 
      title: "Interest Rate",
      render: (r: Liability) => r.interest_rate ? `${r.interest_rate}%` : 'N/A'
    },
    { key: "schedule", title: "Schedule" },
    { key: "remaining_emis", title: "Remaining EMIs" },
    { 
      key: "emi_date", 
      title: "EMI Date",
      render: (r: Liability) => r.emi_date ? new Date(r.emi_date).toLocaleDateString() : 'N/A'
    },
    { 
      key: "as_of_date", 
      title: "As of Date",
      render: (r: Liability) => r.as_of_date ? new Date(r.as_of_date).toLocaleDateString() : 'N/A'
    },
    {
      key: "actions",
      title: "",
      render: (row: Liability) => (
        <div className="relative">
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(menuOpen === row.id ? null : row.id);
            }}
            aria-label="Open menu"
            data-testid={`menu-liabilities-${row.id}`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen === row.id && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(row);
                  setMenuOpen(null);
                }}
                data-testid="action-edit"
              >
                <span>Edit</span>
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(row.id!);
                  setMenuOpen(null);
                }}
                data-testid="action-delete"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading liabilities...</span>
      </div>
    );
  }

  return (
    <div className="p-6" data-testid="liabilities-page">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Liabilities</h2>
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => {
            setEditRow(null);
            setForm({
              type: "",
              institution: "",
              total_amount: "",
              outstanding_amount: "",
              emi_amount: "",
              interest_rate: "",
              schedule: "",
              remaining_emis: "",
              emi_date: "",
              as_of_date: "",
            });
          }}
          data-testid="btn-add-liability"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Liability
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md" role="alert">
          {error}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No liabilities found. Add your first liability to get started.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <DataTable
              columns={columns}
              rows={pagedRows}
              dataTestId="liabilities-table"
              onRowClick={(row) => handleEdit(row as Liability)}
              rowClassName="hover:bg-gray-50 cursor-pointer"
            />
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 px-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Edit/Add Modal */}
      {editRow !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setEditRow(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {editRow.id ? "Edit Liability" : "Add New Liability"}
              </h3>
              <button 
                onClick={() => setEditRow(null)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Home Loan">Home Loan</option>
                    <option value="Car Loan">Car Loan</option>
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Education Loan">Education Loan</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Institution</label>
                  <input
                    type="text"
                    name="institution"
                    value={form.institution}
                    onChange={handleInputChange}
                    placeholder="e.g., HDFC Bank, SBI"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Total Amount (₹)</label>
                  <input
                    type="number"
                    name="total_amount"
                    value={form.total_amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Outstanding Amount (₹)</label>
                  <input
                    type="number"
                    name="outstanding_amount"
                    value={form.outstanding_amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">EMI Amount (₹)</label>
                  <input
                    type="number"
                    name="emi_amount"
                    value={form.emi_amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
                  <input
                    type="number"
                    name="interest_rate"
                    value={form.interest_rate}
                    onChange={handleInputChange}
                    placeholder="e.g., 8.5"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Schedule</label>
                  <select
                    name="schedule"
                    value={form.schedule}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select schedule</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half-yearly">Half-yearly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Remaining EMIs</label>
                  <input
                    type="number"
                    name="remaining_emis"
                    value={form.remaining_emis}
                    onChange={handleInputChange}
                    placeholder="e.g., 24"
                    min="0"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Next EMI Date</label>
                  <input
                    type="date"
                    name="emi_date"
                    value={form.emi_date}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">As of Date</label>
                  <input
                    type="date"
                    name="as_of_date"
                    value={form.as_of_date}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm" role="alert">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditRow(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  data-testid="btn-save-liability"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editRow.id ? 'Update Liability' : 'Add Liability'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Liabilities;
