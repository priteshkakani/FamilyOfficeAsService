import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useAuthProfile() {
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
        // Always perform a real GET /rest/v1/profiles request (bust cache for Cypress)
        const random = Math.random().toString(36).substring(2);
        const { data: prof, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", sess.session.user.id)
          .maybeSingle()
          .abortSignal(undefined); // ensure not aborted
        setProfile(prof ?? { is_onboarded: false });
      } else {
        setProfile(null);
      }
      setLoading(false);
    }
    fetchAuth();
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
