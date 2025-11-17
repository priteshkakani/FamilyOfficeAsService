import { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { notifyError } from "../utils/toast";
import { 
  UseClientDataReturn, 
  Profile, 
  NetWorthView, 
  CashflowView, 
  AssetAllocationView,
  Goal,
  Task,
  Consent
} from "../types/client";
import { useAuth } from "../contexts/AuthProvider";

/**
 * Hook to fetch and manage client data
 * @returns {UseClientDataReturn} Client data and loading state
 */
export default function useClientData() {
  const { user } = useAuth();
  const userId = user?.id;

  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [views, setViews] = useState<{
    netWorth: NetWorthView | null;
    cashflow: CashflowView[];
    allocation: AssetAllocationView[];
  }>({
    netWorth: null,
    cashflow: [],
    allocation: [],
  });
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [consents, setConsents] = useState<Consent[]>([]);

  const fetchAll = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const [
        pRes, 
        netRes, 
        cashRes, 
        allocRes, 
        goalsRes, 
        tasksRes, 
        consentsRes
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase
          .from("vw_net_worth")
          .select("*")
          .eq("user_id", userId)
          .single(),
        supabase
          .from("vw_monthly_cashflow")
          .select("*")
          .eq("user_id", userId)
          .order("month", { ascending: true })
          .limit(12),
        supabase
          .from("vw_asset_allocation")
          .select("*")
          .eq("user_id", userId),
        supabase
          .from("goals")
          .select("*")
          .eq("user_id", userId)
          .order("target_date", { ascending: true }),
        supabase
          .from("tasks")
          .select("*")
          .eq("user_id", userId)
          .order("due_date", { ascending: true })
          .limit(50),
        supabase
          .from("consents")
          .select("*")
          .eq("user_id", userId)
      ]);

      if (pRes.error) throw pRes.error;
      
      setProfile(pRes.data);
      setViews({
        netWorth: netRes.data,
        cashflow: cashRes.data || [],
        allocation: allocRes.data || [],
      });
      setGoals(goalsRes.data || []);
      setTasks(tasksRes.data || []);
      setConsents(consentsRes.data || []);
    } catch (err) {
      console.error("[useClientData][fetchAll]", err);
      notifyError("Failed to load client data");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAll();
    
    const onRefresh = () => fetchAll();
    const onSelect = () => fetchAll();
    
    window.addEventListener("refresh-client-data", onRefresh);
    window.addEventListener("advisor:selectedClient", onSelect);
    
    return () => {
      window.removeEventListener("refresh-client-data", onRefresh);
      window.removeEventListener("advisor:selectedClient", onSelect);
    };
  }, [fetchAll]);

  return { 
    loading, 
    profile, 
    views, 
    goals, 
    tasks, 
    consents, 
    refresh: fetchAll 
  };
};
