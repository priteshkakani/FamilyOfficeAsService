import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { Database } from '../../database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface ClientAndAdvisorData {
  clientName: string;
  clientEmail?: string;
  advisorName: string | null;
  advisorEmail?: string;
}

/**
 * useClientAndAdvisor
 * Fetches client and advisor names for a given clientId.
 * 
 * @param {string | undefined} clientId - The ID of the client to fetch data for
 * @returns {UseQueryResult<ClientAndAdvisorData>} Query result containing client and advisor information
 * 
 * @example
 * const { data: { clientName, advisorName } = {}, isLoading } = useClientAndAdvisor(clientId);
 */
export function useClientAndAdvisor(
  clientId: string | undefined
): UseQueryResult<ClientAndAdvisorData> {
  return useQuery<ClientAndAdvisorData, Error>({
    queryKey: ["names", clientId],
    queryFn: async (): Promise<ClientAndAdvisorData> => {
      if (!clientId) {
        return {
          clientName: "Unnamed Client",
          clientEmail: undefined,
          advisorName: null,
          advisorEmail: undefined,
        };
      }

      // Default values
      const result: ClientAndAdvisorData = {
        clientName: "Unnamed Client",
        advisorName: null,
      };

      try {
        // Fetch client profile
        const { data: clientProfile, error: clientError } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", clientId)
          .single();

        if (clientError) {
          console.error("Error fetching client profile:", clientError);
          throw clientError;
        }

        if (clientProfile) {
          result.clientName = clientProfile.full_name || result.clientName;
          result.clientEmail = clientProfile.email;
        }

        return result;
      } catch (error) {
        console.error("Error in useClientAndAdvisor:", error);
        // Return default values with error state
        return {
          ...result,
          clientName: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
    enabled: !!clientId, // Only run the query if clientId is provided
  });
}
