import React, { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

const AdvisorClientContext = createContext();

export function AdvisorClientProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [clientId, setClientId] = useState(null);
  const [clientMeta, setClientMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  // Hydrate clientId from URL, localStorage, or auto-select
  useEffect(() => {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    let urlClientId =
      params.clientId || new URLSearchParams(location.search).get("client");
    if (
      urlClientId &&
      typeof urlClientId === "string" &&
      uuidRegex.test(urlClientId)
    ) {
      setClientId(urlClientId);
      localStorage.setItem("advisor-selected-client", urlClientId);
      return;
    }
    const stored = localStorage.getItem("advisor-selected-client");
    if (stored && typeof stored === "string" && uuidRegex.test(stored)) {
      setClientId(stored);
      return;
    }
    // No clientId in URL or localStorage: auto-select
    setLoading(true);
    supabase.auth.getUser().then(async ({ data: userData }) => {
      const uid = userData?.user?.id;
      if (!uid) {
        setLoading(false);
        setClientId(null);
        return;
      }
      // Client mode: use auth.uid()
      setClientId(uid);
      localStorage.setItem("advisor-selected-client", uid);
      navigate(`/dashboard/overview`);
      window.dispatchEvent(
        new CustomEvent("advisor:selectedClient", { detail: { clientId: uid } })
      );
      console.log(`[ClientResolve] chose clientId=${uid} (client mode)`);
      setLoading(false);
    });
  }, [location, params, navigate]);

  // Prefetch common client data when clientId is set
  useEffect(() => {
    if (!clientId || !queryClient) return;
    const prefetch = async () => {
      try {
        // profile
        queryClient.prefetchQuery(["client", clientId, "profile"], async () => {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", clientId)
            .maybeSingle();
          return data;
        });
        // assets
        queryClient.prefetchQuery(["assets", clientId], async () => {
          const { data } = await supabase
            .from("assets")
            .select("*")
            .eq("user_id", clientId);
          return data;
        });
        // liabilities
        queryClient.prefetchQuery(["liabilities", clientId], async () => {
          const { data } = await supabase
            .from("liabilities")
            .select("*")
            .eq("user_id", clientId);
          return data;
        });
        // insurance
        queryClient.prefetchQuery(["insurance", clientId], async () => {
          const { data } = await supabase
            .from("insurance_policies")
            .select("*")
            .eq("user_id", clientId);
          return data;
        });
        // income records
        queryClient.prefetchQuery(["income-records", clientId], async () => {
          const { data } = await supabase
            .from("income_records")
            .select("*")
            .eq("user_id", clientId);
          return data;
        });
        // goals
        queryClient.prefetchQuery(["goals", clientId], async () => {
          const { data } = await supabase
            .from("goals")
            .select("*")
            .eq("user_id", clientId);
          return data;
        });
        // family
        queryClient.prefetchQuery(["family", clientId], async () => {
          const { data } = await supabase
            .from("family_members")
            .select("*")
            .eq("user_id", clientId);
          return data;
        });
        // recommendations
        queryClient.prefetchQuery(["reco", clientId], async () => {
          const { data } = await supabase
            .from("recommendations")
            .select("*")
            .eq("user_id", clientId);
          return data;
        });
        // documents
        queryClient.prefetchQuery(["documents", clientId], async () => {
          const { data } = await supabase
            .from("documents")
            .select("*")
            .eq("user_id", clientId);
          return data;
        });
        // views
        queryClient.prefetchQuery(["networth", clientId], async () => {
          const { data } = await supabase
            .from("vw_net_worth")
            .select("*")
            .eq("user_id", clientId)
            .maybeSingle();
          return data;
        });
        queryClient.prefetchQuery(["allocation", clientId], async () => {
          const { data } = await supabase
            .from("vw_asset_allocation")
            .select("*")
            .eq("user_id", clientId);
          return data;
        });
        queryClient.prefetchQuery(["activity", clientId], async () => {
          const { data } = await supabase
            .from("vw_activity_feed")
            .select("*")
            .eq("user_id", clientId)
            .limit(50);
          return data;
        });
      } catch (err) {
        console.error("[AdvisorClientProvider] prefetch error", err);
      }
    };
    prefetch();
  }, [clientId, queryClient]);

  // Fetch client meta
  useEffect(() => {
    if (!clientId) {
      setClientMeta(null);
      return;
    }
    setLoading(true);
    supabase
      .from("profiles")
      .select("id, name, email, mobile")
      .eq("id", clientId)
      .maybeSingle()
      .then(({ data, error }) => {
        setClientMeta(data || null);
        setError(error ? error.message : "");
        setLoading(false);
      });
  }, [clientId]);

  // Update URL and localStorage on client change
  const handleSetClientId = (id) => {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (typeof id === "string" && uuidRegex.test(id)) {
      setClientId(id);
      localStorage.setItem("advisor-selected-client", id);
      navigate(`/advisor/${id}`);
      // dispatch standardized event for other listeners (useClientData etc.)
      window.dispatchEvent(
        new CustomEvent("advisor:selectedClient", { detail: { clientId: id } })
      );
      // invalidate and prefetch relevant queries
      const keys = [
        ["client", id, "profile"],
        ["assets", id],
        ["liabilities", id],
        ["insurance", id],
        ["income-records", id],
        ["goals", id],
        ["family", id],
        ["reco", id],
        ["documents", id],
        ["networth", id],
        ["allocation", id],
        ["activity", id],
      ];
      keys.forEach((k) => queryClient.invalidateQueries(k));
      console.log("[Advisor] Selected client", id, location.pathname);
    } else {
      setClientId(null);
      localStorage.removeItem("advisor-selected-client");
      console.error("Attempted to set invalid clientId:", id);
    }
  };

  if (loading && !clientId) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        data-testid="client-loading"
      >
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto" />
          <div className="mt-2 text-gray-700">Resolving client…</div>
        </div>
      </div>
    );
  }

  return <div data-testid="client-resolved">{children}</div>;
}

// AdvisorClientContext removed for Client Mode. All data should use auth.user.id directly.
