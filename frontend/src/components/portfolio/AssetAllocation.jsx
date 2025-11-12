import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Skeleton } from '../ui/skeleton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function AssetAllocation({ data, isLoading, error }) {
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
        <p className="text-red-600">Failed to load allocation data</p>
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
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="flex items-center justify-center h-64">
          <Skeleton className="h-48 w-48 rounded-full" />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div 
        className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6 text-center"
        data-testid="empty-allocation"
      >
        <h3 className="text-lg font-medium text-blue-800 mb-2">No Allocation Data</h3>
        <p className="text-blue-600">Add assets to see your portfolio allocation</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6" data-testid="chart-allocation">
      <h2 className="text-lg font-semibold mb-4">Asset Allocation</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="allocation_percentage"
              nameKey="category"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [
                `${parseFloat(value).toFixed(2)}%`,
                name
              ]} 
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
