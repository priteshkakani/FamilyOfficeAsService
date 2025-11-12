import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const query = useQuery({
    queryKey: ["profile-session"],
    queryFn: async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess?.session?.user) return { session: null, profile: null };
      let { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sess.session.user.id)
        .maybeSingle();
      if (!prof) {
        // Upsert profile row if missing
        const { data: upserted } = await supabase.from("profiles").upsert(
          {
            id: sess.session.user.id,
            email: sess.session.user.email,
            is_onboarded: false,
          },
          { onConflict: "id" }
        );
        prof = upserted?.[0] || null;
        console.log("[Profile] upserted", prof);
      }
      console.log("[Profile] fetched");
      return { session: sess.session, profile: prof };
    },
    staleTime: 1000 * 60 * 10, // 10 min
    cacheTime: 1000 * 60 * 30, // 30 min
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return (
    <ProfileContext.Provider value={query}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
