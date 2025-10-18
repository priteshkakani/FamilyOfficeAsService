import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

// useAuthState: waits for supabase.auth.getSession() and profile load
export function useAuthState() {
  // Allow tests to inject a deterministic auth state via globalThis.__TEST_AUTH_STATE
  // shape: { loading, session, profile }
  if (typeof globalThis !== "undefined" && globalThis.__TEST_AUTH_STATE) {
    const t = globalThis.__TEST_AUTH_STATE;
    // Test-only override is present; return it synchronously for deterministic tests
    return {
      loading: !!t.loading,
      session: t.session ?? null,
      profile: t.profile ?? null,
    };
  }

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchAuth() {
      setLoading(true);
      // Dynamically import supabaseAuth so tests can call vi.mock() before
      // the module is loaded and control the mocked implementations.
      let supabaseAuth;
      try {
        supabaseAuth = await import("./supabaseAuth");
      } catch (e) {
        // fallback to require when dynamic import isn't available in the env
        // eslint-disable-next-line global-require
        supabaseAuth = require("./supabaseAuth");
      }
      const res = await supabaseAuth.getSession();
      // Support both shapes: { data: { session: ... } } and { session: ... } or { user: ... }
      const sess = res?.data ?? res;
      setSession(sess?.session ?? sess?.session ?? null);
      const userId = sess?.session?.user?.id ?? sess?.user?.id ?? null;
      if (userId) {
        // Allow tests to mock fetchProfile on supabaseAuth
        const prof = supabaseAuth.fetchProfile
          ? await supabaseAuth.fetchProfile(userId)
          : await (async () => {
              const { data } = await supabase
                .from("profiles")
                .select("is_onboarded")
                .eq("id", userId)
                .maybeSingle();
              return data;
            })();
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
      if (typeof listener === "function") {
        listener();
      } else if (listener?.unsubscribe) {
        listener.unsubscribe();
      }
    };
  }, []);
  return { loading, session, profile };
}
