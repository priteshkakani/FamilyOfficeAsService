import { Database } from '../../database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export interface NetWorthView {
  user_id: string;
  total_assets: number;
  total_liabilities: number;
  net_worth: number;
  as_of: string;
}

export interface CashflowView {
  user_id: string;
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface AssetAllocationView {
  user_id: string;
  asset_class: string;
  percentage: number;
  value: number;
}

export interface Goal extends Database['public']['Tables']['goals']['Row'] {}

export interface Task extends Database['public']['Tables']['tasks']['Row'] {}

export interface Consent extends Database['public']['Tables']['consents']['Row'] {}

export interface ClientViews {
  netWorth: NetWorthView | null;
  cashflow: CashflowView[];
  allocation: AssetAllocationView[];
}

export interface UseClientDataReturn {
  loading: boolean;
  profile: Profile | null;
  views: ClientViews;
  goals: Goal[];
  tasks: Task[];
  consents: Consent[];
  refresh: () => Promise<void>;
}
