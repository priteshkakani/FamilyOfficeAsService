import React, { useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('₹', '₹ ');
};

export function LiabilitiesTable({ 
  data = [], 
  isLoading, 
  error, 
  onAdd, 
  onEdit, 
  onDelete,
  isMutating = false
}) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
        <p className="text-red-600">Failed to load liabilities</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div 
        className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6 text-center"
        data-testid="empty-liabilities"
      >
        <h3 className="text-lg font-medium text-blue-800 mb-2">No Liabilities Recorded</h3>
        <p className="text-blue-600 mb-4">Add your first liability to get started</p>
        <Button 
          onClick={onAdd} 
          disabled={isMutating}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Liability
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Liabilities</h3>
        <Button 
          onClick={onAdd} 
          disabled={isMutating}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Liability
        </Button>
      </div>
      <div className="border-t border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institution
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outstanding Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EMI
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interest Rate
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((liability) => (
                <tr key={liability.id} data-testid={`liability-row-${liability.id}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {liability.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {liability.institution}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(liability.outstanding_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {liability.emi ? formatCurrency(liability.emi) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {liability.interest_rate ? `${liability.interest_rate}%` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(liability)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      disabled={isMutating}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(liability.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={isMutating || deletingId === liability.id}
                    >
                      {deletingId === liability.id ? 'Deleting...' : <Trash2 className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
