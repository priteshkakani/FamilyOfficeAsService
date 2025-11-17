import { supabase } from '@/lib/supabase';

// Types for mutual funds
export type MutualFund = {
  id: string;
  user_id: string;
  name: string;
  symbol: string;
  isin: string;
  amfi_code?: string;
  fund_house?: string;
  category?: string;
  nav: number;
  nav_date: string;
  investment_type?: 'growth' | 'idcw' | 'idcw-payout' | 'idcw-reinvestment';
  risk_level?: 'low' | 'low_to_moderate' | 'moderate' | 'moderately_high' | 'high';
  expense_ratio?: number;
  aum?: number;
  min_investment?: number;
  exit_load?: string;
  last_updated: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type CreateMutualFundDTO = Omit<MutualFund, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type UpdateMutualFundDTO = Partial<CreateMutualFundDTO>;

// Types for stocks
export type Stock = {
  id: string;
  user_id: string;
  name: string;
  symbol: string;
  exchange: string;
  isin?: string;
  sector?: string;
  industry?: string;
  current_price: number;
  last_updated: string;
  quantity: number;
  average_buy_price: number;
  investment_value: number;
  current_value: number;
  profit_loss: number;
  profit_loss_percentage: number;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type CreateStockDTO = Omit<Stock, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type UpdateStockDTO = Partial<CreateStockDTO>;

// Mutual Funds CRUD Operations

export const getMutualFunds = async (): Promise<MutualFund[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('mutual_funds')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching mutual funds:', error);
    throw error;
  }

  return data as MutualFund[];
};

export const getMutualFundById = async (id: string): Promise<MutualFund | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('mutual_funds')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching mutual fund:', error);
    throw error;
  }

  return data as MutualFund;
};

export const createMutualFund = async (fund: CreateMutualFundDTO): Promise<MutualFund> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('mutual_funds')
    .insert([{ ...fund, user_id: user.id }])
    .select()
    .single();

  if (error) {
    console.error('Error creating mutual fund:', error);
    throw error;
  }

  return data as MutualFund;
};

export const updateMutualFund = async (
  id: string, 
  updates: UpdateMutualFundDTO
): Promise<MutualFund> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('mutual_funds')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating mutual fund:', error);
    throw error;
  }

  return data as MutualFund;
};

export const deleteMutualFund = async (id: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('mutual_funds')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting mutual fund:', error);
    throw error;
  }
};

// Stocks CRUD Operations

export const getStocks = async (): Promise<Stock[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('stocks')
    .select('*')
    .eq('user_id', user.id)
    .order('symbol', { ascending: true });

  if (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }

  return data as Stock[];
};

export const getStockById = async (id: string): Promise<Stock | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('stocks')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching stock:', error);
    throw error;
  }

  return data as Stock;
};

export const createStock = async (stock: CreateStockDTO): Promise<Stock> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Calculate derived fields
  const current_value = stock.current_price * stock.quantity;
  const investment_value = stock.average_buy_price * stock.quantity;
  const profit_loss = current_value - investment_value;
  const profit_loss_percentage = (profit_loss / investment_value) * 100;

  const { data, error } = await supabase
    .from('stocks')
    .insert([{ 
      ...stock, 
      user_id: user.id,
      current_value,
      investment_value,
      profit_loss,
      profit_loss_percentage
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating stock:', error);
    throw error;
  }

  return data as Stock;
};

export const updateStock = async (
  id: string, 
  updates: UpdateStockDTO
): Promise<Stock> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Recalculate derived fields if relevant fields are being updated
  if (updates.current_price || updates.quantity || updates.average_buy_price) {
    const currentStock = await getStockById(id);
    if (!currentStock) throw new Error('Stock not found');

    const currentPrice = updates.current_price ?? currentStock.current_price;
    const quantity = updates.quantity ?? currentStock.quantity;
    const avgBuyPrice = updates.average_buy_price ?? currentStock.average_buy_price;

    const current_value = currentPrice * quantity;
    const investment_value = avgBuyPrice * quantity;
    const profit_loss = current_value - investment_value;
    const profit_loss_percentage = investment_value > 0 ? (profit_loss / investment_value) * 100 : 0;

    updates = {
      ...updates,
      current_value,
      investment_value,
      profit_loss,
      profit_loss_percentage
    };
  }

  const { data, error } = await supabase
    .from('stocks')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating stock:', error);
    throw error;
  }

  return data as Stock;
};

export const deleteStock = async (id: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('stocks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting stock:', error);
    throw error;
  }
};

// Subscribe to asset changes
export const subscribeToAssets = (
  assetType: 'mutual_funds' | 'stocks',
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`${assetType}_changes`)
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: assetType 
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
};

// Get asset performance summary
export const getAssetPerformanceSummary = async (): Promise<{
  total_investment: number;
  current_value: number;
  profit_loss: number;
  profit_loss_percentage: number;
  by_asset_type: Array<{
    asset_type: string;
    investment: number;
    current_value: number;
    allocation_percentage: number;
  }>;
}> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get mutual funds summary
  const { data: mfData } = await supabase
    .from('mutual_funds')
    .select('investment_value, current_value')
    .eq('user_id', user.id);

  // Get stocks summary
  const { data: stocksData } = await supabase
    .from('stocks')
    .select('investment_value, current_value')
    .eq('user_id', user.id);

  // Calculate totals
  const mfInvestment = mfData?.reduce((sum, mf) => sum + (mf.investment_value || 0), 0) || 0;
  const mfCurrentValue = mfData?.reduce((sum, mf) => sum + (mf.current_value || 0), 0) || 0;
  
  const stocksInvestment = stocksData?.reduce((sum, stock) => sum + (stock.investment_value || 0), 0) || 0;
  const stocksCurrentValue = stocksData?.reduce((sum, stock) => sum + (stock.current_value || 0), 0) || 0;

  const totalInvestment = mfInvestment + stocksInvestment;
  const totalCurrentValue = mfCurrentValue + stocksCurrentValue;
  const totalProfitLoss = totalCurrentValue - totalInvestment;
  const totalProfitLossPercentage = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

  // Calculate allocation by asset type
  const byAssetType = [
    {
      asset_type: 'Mutual Funds',
      investment: mfInvestment,
      current_value: mfCurrentValue,
      allocation_percentage: totalCurrentValue > 0 ? (mfCurrentValue / totalCurrentValue) * 100 : 0,
    },
    {
      asset_type: 'Stocks',
      investment: stocksInvestment,
      current_value: stocksCurrentValue,
      allocation_percentage: totalCurrentValue > 0 ? (stocksCurrentValue / totalCurrentValue) * 100 : 0,
    },
  ];

  return {
    total_investment: totalInvestment,
    current_value: totalCurrentValue,
    profit_loss: totalProfitLoss,
    profit_loss_percentage: totalProfitLossPercentage,
    by_asset_type: byAssetType,
  };
};
