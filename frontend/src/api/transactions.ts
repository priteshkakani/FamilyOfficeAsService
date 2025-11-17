import { supabase } from '@/lib/supabase';
import { Tables } from '@/lib/supabase';

// Types for our transactions
export type Transaction = {
  id: string;
  user_id: string;
  type: 'buy' | 'sell' | 'dividend' | 'deposit' | 'withdrawal' | 'transfer';
  asset_type: 'stock' | 'mutual_fund' | 'etf' | 'crypto' | 'other';
  asset_id: string;
  asset_name: string;
  symbol: string;
  quantity: number;
  price_per_unit: number;
  total_amount: number;
  fee: number;
  tax: number;
  transaction_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type CreateTransactionDTO = Omit<Transaction, 'id' | 'created_at' | 'updated_at'>;
export type UpdateTransactionDTO = Partial<CreateTransactionDTO>;

// Get all transactions for the current user
export const getTransactions = async (): Promise<Transaction[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  return data as Transaction[];
};

// Get transactions by type (e.g., 'buy', 'sell', 'dividend')
export const getTransactionsByType = async (type: string): Promise<Transaction[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', type)
    .order('transaction_date', { ascending: false });

  if (error) {
    console.error(`Error fetching ${type} transactions:`, error);
    throw error;
  }

  return data as Transaction[];
};

// Get transactions by asset type (e.g., 'stock', 'mutual_fund')
export const getTransactionsByAssetType = async (assetType: string): Promise<Transaction[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .eq('asset_type', assetType)
    .order('transaction_date', { ascending: false });

  if (error) {
    console.error(`Error fetching ${assetType} transactions:`, error);
    throw error;
  }

  return data as Transaction[];
};

// Get a single transaction by ID
export const getTransactionById = async (id: string): Promise<Transaction | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows returned
      return null;
    }
    console.error('Error fetching transaction:', error);
    throw error;
  }

  return data as Transaction;
};

// Create a new transaction
export const createTransaction = async (transaction: CreateTransactionDTO): Promise<Transaction> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('transactions')
    .insert([{ ...transaction, user_id: user.id }])
    .select()
    .single();

  if (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }

  return data as Transaction;
};

// Update an existing transaction
export const updateTransaction = async (
  id: string, 
  updates: UpdateTransactionDTO
): Promise<Transaction> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }

  return data as Transaction;
};

// Delete a transaction
export const deleteTransaction = async (id: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

// Subscribe to transaction changes
export const subscribeToTransactions = (
  callback: (payload: any) => void
) => {
  return supabase
    .channel('transactions')
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'transactions' 
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
};

// Get transactions within a date range
export const getTransactionsByDateRange = async (
  startDate: string, 
  endDate: string
): Promise<Transaction[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .gte('transaction_date', startDate)
    .lte('transaction_date', endDate)
    .order('transaction_date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions by date range:', error);
    throw error;
  }

  return data as Transaction[];
};
