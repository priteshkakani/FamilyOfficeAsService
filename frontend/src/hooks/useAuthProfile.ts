import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Session } from '@supabase/supabase-js';
import { UseAuthProfileReturn, AuthStateChangeEvent } from "../types/auth";

/**
 * Custom hook to manage authentication state and user profile
 * @returns {UseAuthProfileReturn} Object containing loading state, session, and profile data
 */
export function useAuthProfile(): UseAuthProfileReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UseAuthProfileReturn['profile']>(null);

  useEffect(() => {
    let mounted = true;
    
    async function fetchAuth() {
      if (!mounted) return;
      
      setLoading(true);
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(currentSession);
          
          if (currentSession?.user) {
            // Always perform a real GET request (bust cache for Cypress)
            const { data: profileData, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", currentSession.user.id)
              .maybeSingle()
              .abortSignal(undefined); // Ensure not aborted

            if (error) {
              console.error("Error fetching profile:", error);
              setProfile({ is_onboarded: false });
            } else if (mounted) {
              setProfile(profileData || { is_onboarded: false });
            }
          } else if (mounted) {
            setProfile(null);
          }
        }
      } catch (error) {
        console.error("Error in useAuthProfile:", error);
        if (mounted) {
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthStateChangeEvent['event'], session: Session | null) => {
        if (mounted) {
          fetchAuth();
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return { loading, session, profile };
}
