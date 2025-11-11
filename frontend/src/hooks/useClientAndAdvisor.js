import { useQuery } from "@tanstack/react-query";
import supabase from "../src/supabaseClient";
import { useSession } from "@supabase/auth-helpers-react";

/**
 * useClientAndAdvisor
 * Fetches client and advisor names for a given clientId (and optionally advisorId).
 * Returns { clientName, advisorName, isLoading }
 *
 * - clientName: from profiles.full_name where id = clientId
 * - advisorName: not used in Client Mode; always null
 * - Defensive fallback: "Client" / "Advisor" if not loaded
 */
export function useClientAndAdvisor(clientId) {
  return useQuery({
    queryKey: ["names", clientId],
    queryFn: async () => {
      if (!clientId)
        return {
          clientName: "Unnamed Client",
          clientEmail: undefined,
          advisorName: null,
          advisorEmail: undefined,
        };
      let clientName = "Unnamed Client";
      let clientEmail = undefined;
      // Fetch client profile
      const { data: clientProfile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", clientId)
        .single();
      if (clientProfile?.full_name) clientName = clientProfile.full_name;
      if (clientProfile?.email) clientEmail = clientProfile.email;
      return {
        clientName,
        clientEmail,
        advisorName: null,
        advisorEmail: undefined,
      };
    },
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });
}
