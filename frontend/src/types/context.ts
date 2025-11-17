export interface ClientContextType {
  client: {
    id: string;
    email?: string;
    // Add other client properties as needed
  } | null;
  setClient: (client: any) => void; // You might want to type this more strictly
}
