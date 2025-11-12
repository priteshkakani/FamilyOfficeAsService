import { Database } from '../../database.types';

export interface AssetAllocation {
  asset_class: string;
  percentage: number;
  value: number;
  user_id: string;
}

export interface NetWorth {
  id: string;
  user_id: string;
  total_assets: number;
  total_liabilities: number;
  net_worth: number;
  as_of: string;
}

export type Asset = Database['public']['Tables']['assets']['Row'];
export type Liability = Database['public']['Tables']['liabilities']['Row'];

export interface InsurancePolicy {
  id: string;
  user_id: string;
  provider: string;
  policy_no: string;
  type: string;
  sum_assured: number;
  premium: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive' | 'surrendered' | 'matured';
  created_at: string;
  updated_at: string;
}

// Query result types
export type QueryResult<T> = {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};
