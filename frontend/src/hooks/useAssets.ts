import { useState, useEffect, useCallback } from 'react';
import {
  MutualFund,
  CreateMutualFundDTO,
  UpdateMutualFundDTO,
  Stock,
  CreateStockDTO,
  UpdateStockDTO,
  getMutualFunds,
  getMutualFundById,
  createMutualFund,
  updateMutualFund,
  deleteMutualFund,
  getStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
  subscribeToAssets,
  getAssetPerformanceSummary,
} from '@/api/assets';

type AssetPerformanceSummary = Awaited<ReturnType<typeof getAssetPerformanceSummary>>;

export const useAssets = () => {
  // State for mutual funds
  const [mutualFunds, setMutualFunds] = useState<MutualFund[]>([]);
  const [selectedMutualFund, setSelectedMutualFund] = useState<MutualFund | null>(null);
  
  // State for stocks
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  
  // Common state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [performanceSummary, setPerformanceSummary] = useState<AssetPerformanceSummary | null>(null);

  // Fetch all mutual funds
  const fetchMutualFunds = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMutualFunds();
      setMutualFunds(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch mutual funds'));
      console.error('Error in fetchMutualFunds:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single mutual fund by ID
  const fetchMutualFund = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const data = await getMutualFundById(id);
      setSelectedMutualFund(data);
      setError(null);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch mutual fund');
      setError(error);
      console.error('Error in fetchMutualFund:', err);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new mutual fund
  const addMutualFund = useCallback(async (fund: CreateMutualFundDTO) => {
    try {
      setLoading(true);
      const newFund = await createMutualFund(fund);
      setMutualFunds(prev => [...prev, newFund]);
      setError(null);
      return newFund;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add mutual fund');
      setError(error);
      console.error('Error in addMutualFund:', err);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a mutual fund
  const updateMutualFund = useCallback(async (id: string, updates: UpdateMutualFundDTO) => {
    try {
      setLoading(true);
      const updatedFund = await updateMutualFund(id, updates);
      setMutualFunds(prev => 
        prev.map(fund => fund.id === id ? updatedFund : fund)
      );
      if (selectedMutualFund?.id === id) {
        setSelectedMutualFund(updatedFund);
      }
      setError(null);
      return updatedFund;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update mutual fund');
      setError(error);
      console.error('Error in updateMutualFund:', err);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [selectedMutualFund]);

  // Delete a mutual fund
  const removeMutualFund = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await deleteMutualFund(id);
      setMutualFunds(prev => prev.filter(fund => fund.id !== id));
      if (selectedMutualFund?.id === id) {
        setSelectedMutualFund(null);
      }
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete mutual fund');
      setError(error);
      console.error('Error in removeMutualFund:', err);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [selectedMutualFund]);

  // Fetch all stocks
  const fetchStocks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getStocks();
      setStocks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stocks'));
      console.error('Error in fetchStocks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single stock by ID
  const fetchStock = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const data = await getStockById(id);
      setSelectedStock(data);
      setError(null);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch stock');
      setError(error);
      console.error('Error in fetchStock:', err);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new stock
  const addStock = useCallback(async (stock: CreateStockDTO) => {
    try {
      setLoading(true);
      const newStock = await createStock(stock);
      setStocks(prev => [...prev, newStock]);
      setError(null);
      return newStock;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add stock');
      setError(error);
      console.error('Error in addStock:', err);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a stock
  const updateStock = useCallback(async (id: string, updates: UpdateStockDTO) => {
    try {
      setLoading(true);
      const updatedStock = await updateStock(id, updates);
      setStocks(prev => 
        prev.map(stock => stock.id === id ? updatedStock : stock)
      );
      if (selectedStock?.id === id) {
        setSelectedStock(updatedStock);
      }
      setError(null);
      return updatedStock;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update stock');
      setError(error);
      console.error('Error in updateStock:', err);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [selectedStock]);

  // Delete a stock
  const removeStock = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await deleteStock(id);
      setStocks(prev => prev.filter(stock => stock.id !== id));
      if (selectedStock?.id === id) {
        setSelectedStock(null);
      }
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete stock');
      setError(error);
      console.error('Error in removeStock:', err);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [selectedStock]);

  // Fetch asset performance summary
  const fetchPerformanceSummary = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAssetPerformanceSummary();
      setPerformanceSummary(data);
      setError(null);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch performance summary');
      setError(error);
      console.error('Error in fetchPerformanceSummary:', err);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to real-time updates for mutual funds
  useEffect(() => {
    const subscription = subscribeToAssets('mutual_funds', (payload) => {
      if (payload.eventType === 'INSERT') {
        setMutualFunds(prev => [...prev, payload.new as MutualFund]);
      } else if (payload.eventType === 'UPDATE') {
        setMutualFunds(prev => 
          prev.map(fund => fund.id === payload.new.id ? payload.new as MutualFund : fund)
        );
        if (selectedMutualFund?.id === payload.new.id) {
          setSelectedMutualFund(payload.new as MutualFund);
        }
      } else if (payload.eventType === 'DELETE') {
        setMutualFunds(prev => prev.filter(fund => fund.id !== payload.old.id));
        if (selectedMutualFund?.id === payload.old.id) {
          setSelectedMutualFund(null);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedMutualFund]);

  // Subscribe to real-time updates for stocks
  useEffect(() => {
    const subscription = subscribeToAssets('stocks', (payload) => {
      if (payload.eventType === 'INSERT') {
        setStocks(prev => [...prev, payload.new as Stock]);
      } else if (payload.eventType === 'UPDATE') {
        setStocks(prev => 
          prev.map(stock => stock.id === payload.new.id ? payload.new as Stock : stock)
        );
        if (selectedStock?.id === payload.new.id) {
          setSelectedStock(payload.new as Stock);
        }
      } else if (payload.eventType === 'DELETE') {
        setStocks(prev => prev.filter(stock => stock.id !== payload.old.id));
        if (selectedStock?.id === payload.old.id) {
          setSelectedStock(null);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedStock]);

  return {
    // Mutual funds
    mutualFunds,
    selectedMutualFund,
    fetchMutualFunds,
    fetchMutualFund,
    addMutualFund,
    updateMutualFund,
    removeMutualFund,
    setSelectedMutualFund,
    
    // Stocks
    stocks,
    selectedStock,
    fetchStocks,
    fetchStock,
    addStock,
    updateStock,
    removeStock,
    setSelectedStock,
    
    // Performance
    performanceSummary,
    fetchPerformanceSummary,
    
    // Common
    loading,
    error,
  };
};
