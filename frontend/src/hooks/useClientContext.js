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
