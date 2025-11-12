import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();

export function getDisplayName(user, profile) {
  return (
    profile?.full_name?.trim() ||
    user?.user_metadata?.full_name?.trim() ||
    (user?.email ? user.email.split("@")[0] : "") ||
    ""
  );
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user || null);
      setAuthLoading(false);
      console.log("[Auth] initial session", data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user || null);
        setAuthLoading(false);
        console.log("[Auth] onAuthStateChange", session);
      }
    );
    return () => {
      mounted = false;
      listener?.unsubscribe?.();
    };
  }, []);

  // Profile fetch/caching
  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      // If profile missing, upsert once
      if (!data) {
        await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
          full_name:
            user.user_metadata?.full_name || user.email.split("@")[0] || "",
        });
        // Refetch after upsert
        const { data: newData } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .eq("id", user.id)
          .maybeSingle();
        return newData;
      }
      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        authLoading,
        profile,
        profileLoading,
        getDisplayName,
        refetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
