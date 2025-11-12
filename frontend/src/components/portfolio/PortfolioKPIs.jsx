import React from 'react';
import { Skeleton } from '../ui/skeleton';

export function PortfolioKPIs({ netWorth, isLoading, error }) {
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
        <p className="text-red-600">Failed to load portfolio data</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (!netWorth) {
    return (
      <div 
        className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6 text-center"
        data-testid="empty-networth"
      >
        <h3 className="text-lg font-medium text-blue-800 mb-2">No Portfolio Data</h3>
        <p className="text-blue-600 mb-4">Add assets or liabilities to see your net worth</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Net Worth</h3>
        <p className="text-2xl font-bold" data-testid="kpi-net-worth">
          ₹{netWorth.net_worth?.toLocaleString('en-IN') || '0'}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Assets</h3>
        <p className="text-2xl font-bold" data-testid="kpi-total-assets">
          ₹{netWorth.total_assets?.toLocaleString('en-IN') || '0'}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Liabilities</h3>
        <p className="text-2xl font-bold" data-testid="kpi-total-liabilities">
          ₹{netWorth.total_liabilities?.toLocaleString('en-IN') || '0'}
        </p>
      </div>
    </div>
  );
}
