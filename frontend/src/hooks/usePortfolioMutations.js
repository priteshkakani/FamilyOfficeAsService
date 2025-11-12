import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';

export function usePortfolioMutations() {
  const queryClient = useQueryClient();

  const handleError = (error) => {
    console.error('Mutation error:', error);
    toast.error(error.message || 'An error occurred');
    throw error;
  };

  const invalidatePortfolioQueries = (userId) => {
    queryClient.invalidateQueries(['portfolio-allocation', userId]);
    queryClient.invalidateQueries(['portfolio-networth', userId]);
  };

  // Asset Mutations
  const addAsset = useMutation(
    async ({ userId, assetData }) => {
      const { data, error } = await supabase
        .from('assets')
        .insert([{ ...assetData, user_id: userId }])
        .select();
      if (error) throw error;
      return data?.[0];
    },
    {
      onSuccess: (_, { userId }) => {
        queryClient.invalidateQueries(['assets', userId]);
        invalidatePortfolioQueries(userId);
        toast.success('Asset added successfully');
      },
      onError: handleError,
    }
  );

  const updateAsset = useMutation(
    async ({ id, userId, updates }) => {
      const { data, error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select();
      if (error) throw error;
      return data?.[0];
    },
    {
      onSuccess: (_, { userId }) => {
        queryClient.invalidateQueries(['assets', userId]);
        invalidatePortfolioQueries(userId);
        toast.success('Asset updated successfully');
      },
      onError: handleError,
    }
  );

  const deleteAsset = useMutation(
    async ({ id, userId }) => {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      if (error) throw error;
    },
    {
      onSuccess: (_, { userId }) => {
        queryClient.invalidateQueries(['assets', userId]);
        invalidatePortfolioQueries(userId);
        toast.success('Asset deleted successfully');
      },
      onError: handleError,
    }
  );

  // Similar mutation patterns for liabilities and insurance
  // ...

  return {
    // Asset mutations
    addAsset,
    updateAsset,
    deleteAsset,
    // Add other mutations here
  };
}
