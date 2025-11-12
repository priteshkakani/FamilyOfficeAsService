import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { AssetAllocation, NetWorth, Asset, Liability, InsurancePolicy } from '../types/portfolio';

/**
 * Hook to fetch portfolio allocation data
 * @param userId - The ID of the user
 * @returns Query result with portfolio allocation data
 */
export function usePortfolioAllocation(userId: string | undefined): UseQueryResult<AssetAllocation[], Error> {
  return useQuery<AssetAllocation[], Error>({
    queryKey: ['portfolio-allocation', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vw_asset_allocation')
        .select('*')
        .eq('user_id', userId!);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch portfolio net worth data
 * @param userId - The ID of the user
 * @returns Query result with net worth data
 */
export function usePortfolioNetWorth(userId: string | undefined): UseQueryResult<NetWorth, Error> {
  return useQuery<NetWorth, Error>({
    queryKey: ['portfolio-networth', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vw_net_worth')
        .select('*')
        .eq('user_id', userId!)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('No net worth data found');
      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch user assets
 * @param userId - The ID of the user
 * @returns Query result with assets data
 */
export function useAssets(userId: string | undefined): UseQueryResult<Asset[], Error> {
  return useQuery<Asset[], Error>({
    queryKey: ['assets', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', userId!)
        .order('as_of_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch user liabilities
 * @param userId - The ID of the user
 * @returns Query result with liabilities data
 */
export function useLiabilities(userId: string | undefined): UseQueryResult<Liability[], Error> {
  return useQuery<Liability[], Error>({
    queryKey: ['liabilities', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('liabilities')
        .select('*')
        .eq('user_id', userId!);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch user insurance policies
 * @param userId - The ID of the user
 * @returns Query result with insurance policies data
 */
export function useInsurancePolicies(userId: string | undefined): UseQueryResult<InsurancePolicy[], Error> {
  return useQuery<InsurancePolicy[], Error>({
    queryKey: ['insurance', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_policies')
        .select('*')
        .eq('user_id', userId!);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
