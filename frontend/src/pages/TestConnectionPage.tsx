import React from 'react';
import TestSupabaseConnection from '../components/TestSupabaseConnection';

const TestConnectionPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Connection Status</h2>
            <TestSupabaseConnection />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
            <div className="bg-gray-50 p-4 rounded text-sm font-mono">
              <p>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</p>
              <p className="mt-1">VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestConnectionPage;
