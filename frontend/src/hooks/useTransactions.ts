import { useState, useEffect, useCallback } from 'react';
import { 
  Transaction, 
  CreateTransactionDTO, 
  UpdateTransactionDTO,
  getTransactions,
  getTransactionsByType,
  getTransactionsByAssetType,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  subscribeToTransactions,
  getTransactionsByDateRange
} from '@/api/transactions';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all transactions
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
      console.error('Error in fetchTransactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch transactions by type
  const fetchByType = useCallback(async (type: string) => {
    try {
      setLoading(true);
      const data = await getTransactionsByType(type);
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch ${type} transactions`));
      console.error(`Error in fetchByType (${type}):`, err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch transactions by asset type
  const fetchByAssetType = useCallback(async (assetType: string) => {
    try {
      setLoading(true);
      const data = await getTransactionsByAssetType(assetType);
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch ${assetType} transactions`));
      console.error(`Error in fetchByAssetType (${assetType}):`, err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch transactions by date range
  const fetchByDateRange = useCallback(async (startDate: string, endDate: string) => {
    try {
      setLoading(true);
      const data = await getTransactionsByDateRange(startDate, endDate);
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions by date range'));
      console.error('Error in fetchByDateRange:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single transaction by ID
  const getTransaction = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const data = await getTransactionById(id);
      setError(null);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch transaction');
      setError(error);
      console.error('Error in getTransaction:', err);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new transaction
  const addTransaction = useCallback(async (transaction: CreateTransactionDTO) => {
    try {
      setLoading(true);
      const newTransaction = await createTransaction(transaction);
      setTransactions(prev => [newTransaction, ...prev]);
      setError(null);
      return newTransaction;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add transaction');
      setError(error);
      console.error('Error in addTransaction:', err);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing transaction
  const updateTransaction = useCallback(async (id: string, updates: UpdateTransactionDTO) => {
    try {
      setLoading(true);
      const updatedTransaction = await updateTransaction(id, updates);
      setTransactions(prev => 
        prev.map(tx => tx.id === id ? updatedTransaction : tx)
      );
      setError(null);
      return updatedTransaction;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update transaction');
      setError(error);
      console.error('Error in updateTransaction:', err);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a transaction
  const removeTransaction = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await deleteTransaction(id);
      setTransactions(prev => prev.filter(tx => tx.id !== id));
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete transaction');
      setError(error);
      console.error('Error in removeTransaction:', err);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = subscribeToTransactions((payload) => {
      if (payload.eventType === 'INSERT') {
        setTransactions(prev => [payload.new as Transaction, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setTransactions(prev => 
          prev.map(tx => tx.id === payload.new.id ? payload.new as Transaction : tx)
        );
      } else if (payload.eventType === 'DELETE') {
        setTransactions(prev => prev.filter(tx => tx.id !== payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    fetchByType,
    fetchByAssetType,
    fetchByDateRange,
    getTransaction,
    addTransaction,
    updateTransaction,
    removeTransaction,
  };
};
