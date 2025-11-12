import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";

type QuerySection = 'overview' | 'assets' | 'liabilities' | 'goals' | 'insurance' | 'documents';
type QuerySubtab = string | undefined;

/**
 * Hook to fetch client data based on section and subtab
 * 
 * @param {string | undefined} userId - The ID of the user to fetch data for
 * @param {QuerySection} section - The main section of data to fetch
 * @param {QuerySubtab} [subtab] - Optional subtab for more specific data fetching
 * @returns {UseQueryResult<unknown, Error>} Query result with the fetched data
 */
function useQueryClientData(
  userId: string | undefined,
  section: QuerySection,
  subtab?: QuerySubtab
): UseQueryResult<unknown, Error> {
  return useQuery<unknown, Error>({
    queryKey: ["dashboard", userId, section, subtab],
    queryFn: async (): Promise<unknown> => {
      if (!userId) {
        throw new Error('User ID is required to fetch client data');
      }

      try {
        let query = supabase;
        let select = "*";
        let filter = { user_id: userId };

        // Define queries based on section and subtab
        switch (section) {
          case 'assets':
            query = query.from('assets');
            if (subtab) {
              // Add subtab specific filtering if needed
              filter = { ...filter, category: subtab };
            }
            break;
          
          case 'liabilities':
            query = query.from('liabilities');
            if (subtab) {
              filter = { ...filter, type: subtab };
            }
            break;
          
          case 'goals':
            query = query.from('goals');
            // Add any goal-specific filtering
            break;
          
          case 'insurance':
            query = query.from('insurance_policies');
            if (subtab) {
              filter = { ...filter, type: subtab };
            }
            break;
          
          case 'documents':
            query = query.from('documents');
            if (subtab) {
              filter = { ...filter, category: subtab };
            }
            break;
          
          case 'overview':
          default:
            // Default to fetching basic profile for overview
            query = query.from('profiles').select('*').eq('id', userId).single();
            const { data, error } = await query;
            
            if (error) throw error;
            return data || null;
        }

        // Execute the query with common filters
        const { data, error } = await query
          .select(select)
          .match(filter);

        if (error) throw error;
        return data || [];

      } catch (error) {
        console.error(`Error fetching ${section} data:`, error);
        throw new Error(`Failed to load ${section} data: ${error.message}`);
      }
    },
    enabled: !!userId, // Only run query if userId exists
    staleTime: 60_000, // 1 minute
    retry: 2, // Retry failed requests twice
  });
}

export default useQueryClientData;
