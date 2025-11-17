import React from 'react';

const ActivityPage = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity</h2>
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-500">Your recent actions will appear here</p>
            </div>
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              New
            </span>
          </div>
        </div>
        {/* Add more activity items as needed */}
      </div>
    </div>
  );
};

export default ActivityPage;
