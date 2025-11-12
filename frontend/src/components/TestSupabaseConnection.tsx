import { useEffect, useState } from 'react';
import { getCurrentSession, getCurrentUserId, supabase } from '../lib/supabase';

const TestSupabaseConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    loading: true,
    connected: false,
    error: null as string | null,
    session: null as any,
    userId: null as string | null,
  });

  useEffect(() => {
    const testConnection = async () => {
      try {
        setConnectionStatus(prev => ({ ...prev, loading: true }));
        
        // Test basic Supabase client
        const { data: health } = await supabase.rpc('get_health');
        
        // Test auth
        const session = await getCurrentSession();
        const userId = await getCurrentUserId();
        
        setConnectionStatus({
          loading: false,
          connected: true,
          error: null,
          session,
          userId,
        });
        
        console.log('Supabase connection successful!', { 
          health, 
          session,
          userId,
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL
        });
      } catch (error) {
        console.error('Supabase connection test failed:', error);
        setConnectionStatus({
          loading: false,
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          session: null,
          userId: null,
        });
      }
    };

    testConnection();
  }, []);

  if (connectionStatus.loading) {
    return (
      <div className="p-4 bg-blue-50 text-blue-800 rounded-md">
        <p>Testing Supabase connection...</p>
      </div>
    );
  }

  if (connectionStatus.error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <h3 className="font-bold">Connection Failed</h3>
        <p className="mb-2">Error: {connectionStatus.error}</p>
        <div className="text-sm bg-red-100 p-2 rounded">
          <p>Supabase URL: {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</p>
          <p>Anon Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 text-green-800 rounded-md">
      <h3 className="font-bold">Connection Successful! 🎉</h3>
      <div className="mt-2 space-y-1 text-sm">
        <p>✅ Connected to Supabase</p>
        <p>🔗 URL: {import.meta.env.VITE_SUPABASE_URL}</p>
        <p>👤 User ID: {connectionStatus.userId || 'Not authenticated'}</p>
        {connectionStatus.session && (
          <div className="mt-2 p-2 bg-green-100 rounded">
            <p className="font-medium">Session Info:</p>
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify(connectionStatus.session, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSupabaseConnection;
