import React, { createContext, useContext, useEffect, useState } from "react";

const ClientContext = createContext();

export function ClientProvider({ children }) {
  const [client, setClientState] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("advisor:selectedClient");
    try {
      if (raw) setClientState(JSON.parse(raw));
    } catch (e) {
      setClientState(raw);
    }
  }, []);

  const setClient = (c) => {
    setClientState(c);
    try {
      if (c) localStorage.setItem("advisor:selectedClient", JSON.stringify(c));
      else localStorage.removeItem("advisor:selectedClient");
    } catch (e) {
      // ignore
    }
    // notify other listeners (useClientData listens for this)
    window.dispatchEvent(
      new CustomEvent("advisor:selectedClient", { detail: { client: c } })
    );
  };

  return (
    <ClientContext.Provider value={{ client, setClient }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  return useContext(ClientContext);
}
