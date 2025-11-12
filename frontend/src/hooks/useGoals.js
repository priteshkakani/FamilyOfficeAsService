import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';

export function useGoals() {
  const queryClient = useQueryClient();

  // Get current session
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
  } = useQuery({
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
  const createGoal = useMutation({
    mutationFn: async (goalData) => {
      const session = await getSession();
      
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
        priority: goalData.priority || 'medium',
        is_completed: false,
      };
      
      const { data, error } = await supabase
        .from('goals')
        .insert(payload)
        .select()
        .single();
        
      if (error) {
        console.error('Create goal error:', error);
        throw new Error(error.message || 'Failed to create goal');
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['goals']);
      toast.success('Goal created successfully');
    },
    onError: (error) => {
      console.error('Error in createGoal:', error);
      toast.error(error.message || 'Failed to create goal');
    },
  });

  // Update a goal
  const updateGoal = useMutation({
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
      queryClient.invalidateQueries(['goals']);
      toast.success('Goal updated successfully');
    },
    onError: (error) => {
      console.error('Error in updateGoal:', error);
      toast.error(error.message || 'Failed to update goal');
    },
  });

  // Delete a goal
  const deleteGoal = useMutation({
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
      queryClient.invalidateQueries(['goals']);
      toast.success('Goal deleted successfully');
    },
    onError: (error) => {
      console.error('Error in deleteGoal:', error);
      toast.error(error.message || 'Failed to delete goal');
    },
  });

  return {
    goals,
    isLoading,
    error,
    refetch,
    createGoal: createGoal.mutateAsync,
    updateGoal: updateGoal.mutateAsync,
    deleteGoal: deleteGoal.mutateAsync,
    isCreating: createGoal.isLoading,
    isUpdating: updateGoal.isLoading,
    isDeleting: deleteGoal.isLoading,
  };
}
