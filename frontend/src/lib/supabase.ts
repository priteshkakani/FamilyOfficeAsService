import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables should be prefixed with VITE_ to be exposed to the client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fomyxahwvnfivxvrjtpf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbXl4YWh3dm5maXZ4dnJqdHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTgzMDAsImV4cCI6MjA3NTU3NDMwMH0.WT_DEOJ5otbwbhD_trLNa806d08WYwMfk0QWajsFVdw';

// Validate that we have the required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key. Please check your environment variables.');
}

// Create a single supabase client for interacting with your database
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  // Configure realtime for subscriptions
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper to get the current user's ID
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

// Helper to get the current session
export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Helper to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
};

// Subscribe to auth state changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

// Export types for better TypeScript support
export type Tables = {
  profiles: {
    Row: {
      id: string;
      updated_at?: string | null;
      username?: string | null;
      full_name?: string | null;
      avatar_url?: string | null;
      website?: string | null;
    };
    Insert: {
      id: string;
      updated_at?: string | null;
      username?: string | null;
      full_name?: string | null;
      avatar_url?: string | null;
      website?: string | null;
    };
    Update: {
      id?: string;
      updated_at?: string | null;
      username?: string | null;
      full_name?: string | null;
      avatar_url?: string | null;
      website?: string | null;
    };
  };
  // Add other tables as needed
};

export default supabase;
