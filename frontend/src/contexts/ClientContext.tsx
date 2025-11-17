import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface Client {
  id: string;
  email?: string;
  // Add other client properties as needed
  [key: string]: any; // Allow additional properties
}

interface ClientContextType {
  client: Client | null;
  setClient: (client: Client | null) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

interface ClientProviderProps {
  children: ReactNode;
}

export function ClientProvider({ children }: ClientProviderProps) {
  const [client, setClientState] = useState<Client | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("advisor:selectedClient");
    if (!raw) return;
    
    try {
      const parsed = JSON.parse(raw);
      setClientState(parsed);
    } catch (e) {
      console.error("Failed to parse client data from localStorage", e);
    }
  }, []);

  const setClient = (c: Client | null) => {
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
