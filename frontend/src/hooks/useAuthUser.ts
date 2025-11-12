import { useEffect, useState } from "react";
import { User } from '@supabase/supabase-js';
import { supabase } from "../supabaseClient";

/**
 * Custom hook to get the currently authenticated user
 * @returns {User | null} The current user or null if not authenticated
 */
export default function useAuthUser(): User | null {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting initial session:', error);
        setUser(null);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return user;
}
