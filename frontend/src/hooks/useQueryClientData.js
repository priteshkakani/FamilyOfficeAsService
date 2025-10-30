import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";

export default function useQueryClientData(userId, section, subtab) {
  // Example: fetch logic per section/subtab
  return useQuery({
    queryKey: ["dashboard", userId, section, subtab],
    queryFn: async () => {
      // Replace with actual fetch logic per section/subtab
      // e.g. supabase.from(...).select(...)
      return null;
    },
    staleTime: 60_000,
  });
}
