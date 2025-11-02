import React, { createContext, useContext, useEffect, useState } from "react";
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

  // Hydrate clientId from URL or localStorage
  useEffect(() => {
    // UUID v4 regex
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
    } else {
      const stored = localStorage.getItem("advisor-selected-client");
      if (stored && typeof stored === "string" && uuidRegex.test(stored)) {
        setClientId(stored);
      } else {
        setClientId(null);
      }
    }
  }, [location, params]);

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
      console.log("[Advisor] Selected client", id, location.pathname);
    } else {
      setClientId(null);
      localStorage.removeItem("advisor-selected-client");
      console.error("Attempted to set invalid clientId:", id);
    }
  };

  return (
    <AdvisorClientContext.Provider
      value={{
        clientId,
        clientMeta,
        setClientId: handleSetClientId,
        loading,
        error,
      }}
    >
      {children}
    </AdvisorClientContext.Provider>
  );
}

export function useAdvisorClient() {
  return useContext(AdvisorClientContext);
}
