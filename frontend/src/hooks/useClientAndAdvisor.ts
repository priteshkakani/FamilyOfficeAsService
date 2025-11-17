import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthProvider";
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
 * Fetches client and advisor information for the current authenticated user.
 * 
 * @returns {UseQueryResult<ClientAndAdvisorData>} Query result containing client and advisor information
 * 
 * @example
 * const { data: { clientName, advisorName } = {}, isLoading } = useClientAndAdvisor();
 */
export function useClientAndAdvisor(): UseQueryResult<ClientAndAdvisorData> {
  const { user } = useAuth();
  const userId = user?.id;
  return useQuery<ClientAndAdvisorData, Error>({
    queryKey: ["userProfile", userId],
    queryFn: async (): Promise<ClientAndAdvisorData> => {
      if (!userId) {
        return {
          clientName: "Unnamed User",
          clientEmail: undefined,
          advisorName: null,
          advisorEmail: undefined,
        };
      }

      // Default values
      const result: ClientAndAdvisorData = {
        clientName: "Unnamed User",
        advisorName: null,
      };

      try {
        // Fetch user profile
        const { data: userProfile, error: userError } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", userId)

        // Handle user profile fetch error
        if (userError) {
          console.error("Error fetching user profile:", userError);
          return result;
        }

        // Update user info if available
        if (userProfile) {
          result.clientName = userProfile.full_name || "Unnamed User";
          result.clientEmail = userProfile.email;
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
    enabled: !!userId, // Only run the query if user is authenticated
  });
}
