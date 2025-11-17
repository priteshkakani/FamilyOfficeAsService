import { useMutation, useQuery, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import { Goal, CreateGoalInput, UpdateGoalInput, UseGoalsReturn, GoalPriority } from '../types/goals';

/**
 * Custom hook to manage goals CRUD operations
 * @returns {UseGoalsReturn} Object containing goals data and mutation functions
 */
export function useGoals(): UseGoalsReturn {
  const queryClient = useQueryClient();

  // Get current session with proper typing
  const getSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.user?.id) {
      throw new Error('Not authenticated');
    }
    return session;
  };

  // Fetch user's goals
  const { 
    data: goals = [], 
    isLoading, 
    error,
    refetch
  } = useQuery<Goal[], Error>({
    queryKey: ['goals'],
    queryFn: async () => {
      const session = await getSession();
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching goals:', error);
        throw new Error('Failed to load goals');
      }
      
      return data || [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create a new goal
  const createGoal = useMutation<Goal, Error, CreateGoalInput>({
    mutationFn: async (goalData) => {
      // Get current session with proper error handling
      const session = await getSession();
      
      if (!session?.user?.id) {
        throw new Error('Authentication required');
      }
      
      // Validate required fields
      if (!goalData.title?.trim()) {
        throw new Error('Title is required');
      }
      
      const payload = {
        user_id: session.user.id,
        title: goalData.title.trim(),
        description: goalData.description?.trim() || null,
        target_amount: goalData.target_amount ? Number(goalData.target_amount) : null,
        target_year: goalData.target_year ? Number(goalData.target_year) : null,
        priority: (goalData.priority || 'medium') as GoalPriority,
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add debug logging
      console.log('Creating goal with payload:', payload);
      
      const { data, error, status, statusText } = await supabase
        .from('goals')
        .insert(payload)
        .select()
        .single();
        
      if (error) {
        console.error('Create goal error:', {
          error,
          status,
          statusText,
          payload,
          hasUserId: !!payload.user_id,
          userId: payload.user_id
        });
        
        // Provide more specific error messages based on the error code
        if (error.code === '42501') {
          throw new Error('Permission denied. Please check if you have the proper permissions to create goals.');
        } else if (error.code === '23505') { // Unique violation
          throw new Error('A goal with this title already exists');
        } else if (error.code === '23503') { // Foreign key violation
          throw new Error('Invalid user reference');
        }
        
        throw new Error(error.message || 'Failed to create goal');
      }
      
      if (!data) {
        throw new Error('No data returned from the server');
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal created successfully');
    },
    onError: (error: Error) => {
      console.error('Error in createGoal:', error);
      toast.error(error.message || 'Failed to create goal');
    },
  });

  // Update a goal
  const updateGoal = useMutation<Goal, Error, { id: string; updates: UpdateGoalInput }>({
    mutationFn: async ({ id, updates }) => {
      const session = await getSession();
      
      if (updates.title !== undefined && !updates.title?.trim()) {
        throw new Error('Title is required');
      }
      
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .eq('user_id', session.user.id)
        .select()
        .single();
        
      if (error) {
        console.error('Update goal error:', error);
        throw new Error(error.message || 'Failed to update goal');
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal updated successfully');
    },
    onError: (error: Error) => {
      console.error('Error in updateGoal:', error);
      toast.error(error.message || 'Failed to update goal');
    },
  });

  // Delete a goal
  const deleteGoal = useMutation<string, Error, string>({
    mutationFn: async (id) => {
      const session = await getSession();
      
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);
        
      if (error) {
        console.error('Delete goal error:', error);
        throw new Error(error.message || 'Failed to delete goal');
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal deleted successfully');
    },
    onError: (error: Error) => {
      console.error('Error in deleteGoal:', error);
      toast.error(error.message || 'Failed to delete goal');
    },
  });

  return {
    goals,
    isLoading,
    error,
    refetch,
    createGoal: {
      mutate: (goalData: CreateGoalInput) => createGoal.mutate(goalData),
      isLoading: createGoal.isPending,
      error: createGoal.error,
    },
    updateGoal: {
      mutate: (params: { id: string; updates: UpdateGoalInput }) => 
        updateGoal.mutate(params),
      isLoading: updateGoal.isPending,
      error: updateGoal.error,
    },
    deleteGoal: {
      mutate: (id: string) => deleteGoal.mutate(id),
      isLoading: deleteGoal.isPending,
      error: deleteGoal.error,
    },
  };
}
