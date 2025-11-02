// Removed illegal top-level return statement. If you need a useClientContext hook, define it as a function:
// import { useContext } from "react";
// import { AdvisorClientContext } from "../contexts/AdvisorClientContext";
// export function useClientContext() {
//   const { clientId, setClientId } = useContext(AdvisorClientContext);
//   const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
//   const isValidClientId = typeof clientId === "string" && uuidRegex.test(clientId);
//   return { clientId: isValidClientId ? clientId : null, setClientId };
// }
import React, { createContext, useContext, useEffect, useState } from "react";

const ClientContext = createContext();

export function ClientProvider({ children }) {
  const [selectedClient, setSelectedClient] = useState(null);
  useEffect(() => {
    const s = localStorage.getItem("advisor:selectedClient");
    if (s) setSelectedClient(s);
  }, []);
  useEffect(() => {
    if (selectedClient)
      localStorage.setItem("advisor:selectedClient", selectedClient);
    else localStorage.removeItem("advisor:selectedClient");
    // notify other components
    window.dispatchEvent(
      new CustomEvent("advisor:selectedClient", {
        detail: { clientId: selectedClient },
      })
    );
  }, [selectedClient]);

  return React.createElement(
    ClientContext.Provider,
    { value: { selectedClient, setSelectedClient } },
    children
  );
}

export function useClient() {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error("useClient must be used inside ClientProvider");
  return ctx;
}
