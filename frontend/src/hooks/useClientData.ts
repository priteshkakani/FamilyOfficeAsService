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

/**
 * Hook to fetch and manage client data
 * @param {string} clientId - The ID of the client to fetch data for
 * @returns {UseClientDataReturn} Client data and loading state
 */
const useClientData = (clientId: string | undefined): UseClientDataReturn => {
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
    if (!clientId) return;
    
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
        supabase.from("profiles").select("*").eq("id", clientId).single(),
        supabase
          .from("vw_net_worth")
          .select("*")
          .eq("user_id", clientId)
          .single(),
        supabase
          .from("vw_monthly_cashflow")
          .select("*")
          .eq("user_id", clientId)
          .order("month", { ascending: true })
          .limit(12),
        supabase
          .from("vw_asset_allocation")
          .select("*")
          .eq("user_id", clientId),
        supabase
          .from("goals")
          .select("*")
          .eq("user_id", clientId)
          .order("target_date", { ascending: true }),
        supabase
          .from("tasks")
          .select("*")
          .eq("user_id", clientId)
          .order("due_date", { ascending: true })
          .limit(50),
        supabase
          .from("consents")
          .select("*")
          .eq("user_id", clientId)
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
  }, [clientId]);

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

export default useClientData;
