import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

// useAuthState: waits for supabase.auth.getSession() and profile load
export function useAuthState() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchAuth() {
      setLoading(true);
      const { data: sess } = await supabase.auth.getSession();
      setSession(sess?.session ?? null);
      if (sess?.session?.user) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("is_onboarded")
          .eq("id", sess.session.user.id)
          .maybeSingle();
        setProfile(prof ?? { is_onboarded: false });
      } else {
        setProfile(null);
      }
      setLoading(false);
    }
    fetchAuth();
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchAuth();
    });
    return () => {
      mounted = false;
      listener?.unsubscribe();
    };
  }, []);
  return { loading, session, profile };
}
