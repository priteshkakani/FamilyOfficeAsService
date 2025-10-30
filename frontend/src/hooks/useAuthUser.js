import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function useAuthUser() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session?.user ?? null);
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => {
      listener?.unsubscribe();
    };
  }, []);
  return user;
}
