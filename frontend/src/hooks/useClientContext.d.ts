import { Client } from '../contexts/ClientContext';

interface ClientContextType {
  client: Client | null;
  setClient: (client: Client | null) => void;
}

declare const useClient: () => ClientContextType;

export { useClient };
