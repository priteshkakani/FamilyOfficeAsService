import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';

export function usePortfolioAllocation(userId) {
  return useQuery({
    queryKey: ['portfolio-allocation', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vw_asset_allocation')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePortfolioNetWorth(userId) {
  return useQuery({
    queryKey: ['portfolio-networth', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vw_net_worth')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAssets(userId) {
  return useQuery({
    queryKey: ['assets', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assets')
        .select('id, name, category, amount, as_of_date')
        .eq('user_id', userId)
        .order('as_of_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLiabilities(userId) {
  return useQuery({
    queryKey: ['liabilities', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('liabilities')
        .select('id, type, institution, outstanding_amount, emi, interest_rate, as_of_date')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useInsurancePolicies(userId) {
  return useQuery({
    queryKey: ['insurance', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_policies')
        .select('id, provider, policy_no, type, sum_assured, premium, start_date, end_date, status')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
