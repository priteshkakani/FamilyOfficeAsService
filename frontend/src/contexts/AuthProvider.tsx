import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContextType, Profile } from "../types/auth";

const AuthContext = createContext<AuthContextType | null>(null);

export const getDisplayName = (user: any | null, profile: Profile | null): string => {
  return (
    profile?.full_name?.trim() ||
    user?.user_metadata?.full_name?.trim() ||
    (user?.email ? user.email.split("@")[0] : "") ||
    ""
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();
  
  // Handle auth state changes
  const handleAuthChange = useCallback(async (event: string, session: Session | null) => {
    console.log(`[Auth] ${event}`, session);
    setSession(session);
    setUser(session?.user || null);
    
    // Clear queries on sign out
    if (event === 'SIGNED_OUT') {
      await queryClient.clear();
    }
  }, [queryClient]);
  
  // Handle errors
  const handleError = useCallback((error: Error) => {
    console.error('[Auth] Error:', error);
    toast.error(error.message || 'Authentication error');
  }, []);

  useEffect(() => {
    let mounted = true;
    
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          handleError(error);
          return;
        }
        
        await handleAuthChange('INITIAL_SESSION', session);
      } catch (error) {
        handleError(error as Error);
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        try {
          await handleAuthChange(event, session);
        } catch (error) {
          handleError(error as Error);
        }
      }
    );
    
    // Initialize auth
    initializeAuth();
    
    // Cleanup
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [handleAuthChange, handleError]);

  // Profile fetch/caching with error handling and retry logic
  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useQuery<Profile | null>({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        // First try to get the profile
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .eq("id", user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        // If no profile exists, create one
        if (!data) {
          const { error: upsertError } = await supabase
            .from("profiles")
            .upsert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
              updated_at: new Date().toISOString(),
            });
            
          if (upsertError) throw upsertError;
          
          // Refetch the newly created profile
          const { data: newProfile, error: fetchError } = await supabase
            .from("profiles")
            .select("id, full_name, email")
            .eq("id", user.id)
            .maybeSingle();
            
          if (fetchError) throw fetchError;
          return newProfile;
        }
        
        return data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (profile not found)
      if (error.code === 'PGRST116') return false;
      return failureCount < 3; // Retry up to 3 times for other errors
    },
    refetchOnWindowFocus: false,
  });

  const contextValue: AuthContextType = {
    session,
    user,
    authLoading,
    profile: profile || null,
    profileLoading,
    getDisplayName,
    refetchProfile: async () => {
      try {
        await refetchProfile();
      } catch (error) {
        console.error('Error refetching profile:', error);
        throw error;
      }
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
