import { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { notifyError } from "../utils/toast";

export default function useClientData(clientId) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [views, setViews] = useState({
    netWorth: null,
    cashflow: [],
    allocation: [],
  });
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [consents, setConsents] = useState([]);

  const fetchAll = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);
    try {
      const [pRes, netRes, cashRes, allocRes, goalsRes, tasksRes, consentsRes] =
        await Promise.all([
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
          supabase.from("consents").select("*").eq("user_id", clientId),
        ]);
      if (pRes.error) throw pRes.error;
      setProfile(pRes.data);
      setViews((v) => ({
        ...v,
        netWorth: netRes.data || null,
        cashflow: cashRes.data || [],
        allocation: allocRes.data || [],
      }));
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
    const onSelect = (e) => fetchAll();
    window.addEventListener("refresh-client-data", onRefresh);
    window.addEventListener("advisor:selectedClient", onSelect);
    return () => {
      window.removeEventListener("refresh-client-data", onRefresh);
      window.removeEventListener("advisor:selectedClient", onSelect);
    };
  }, [clientId, fetchAll]);

  return { loading, profile, views, goals, tasks, consents, refresh: fetchAll };
}
