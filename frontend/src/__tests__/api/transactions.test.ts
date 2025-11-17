import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import * as transactionsAPI from '@/api/transactions';

// Test data
const testTransaction = {
  type: 'buy',
  asset_type: 'stock',
  asset_id: 'test-stock-1',
  asset_name: 'Test Stock',
  symbol: 'TST',
  quantity: 10,
  price_per_unit: 100,
  total_amount: 1000,
  fee: 10,
  tax: 5,
  transaction_date: new Date().toISOString(),
  notes: 'Test transaction'
};

describe('Transactions API', () => {
  let testTransactionId: string;

  // Create a test transaction before all tests
  beforeAll(async () => {
    // Verify authentication
    const { data: { user } } = await transactionsAPI.supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be authenticated to run tests');
    }
    
    // Create a test transaction
    const { data: transaction, error } = await transactionsAPI.createTransaction({
      ...testTransaction,
      user_id: user.id
    });
    
    if (error || !transaction) {
      throw new Error(`Failed to create test transaction: ${error?.message}`);
    }
    
    testTransactionId = transaction.id;
  });

  // Clean up after all tests
  afterAll(async () => {
    if (testTransactionId) {
      try {
        await transactionsAPI.deleteTransaction(testTransactionId);
      } catch (error) {
        console.error('Error cleaning up test transaction:', error);
      }
    }
  });

  it('should fetch all transactions', async () => {
    const transactions = await transactionsAPI.getTransactions();
    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBeGreaterThanOrEqual(1);
  });

  it('should fetch a transaction by ID', async () => {
    const transaction = await transactionsAPI.getTransactionById(testTransactionId);
    expect(transaction).toBeDefined();
    expect(transaction?.id).toBe(testTransactionId);
    expect(transaction?.symbol).toBe(testTransaction.symbol);
  });

  it('should fetch transactions by type', async () => {
    const transactions = await transactionsAPI.getTransactionsByType('buy');
    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions.every(tx => tx.type === 'buy')).toBe(true);
  });

  it('should fetch transactions by asset type', async () => {
    const transactions = await transactionsAPI.getTransactionsByAssetType('stock');
    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions.every(tx => tx.asset_type === 'stock')).toBe(true);
  });

  it('should update a transaction', async () => {
    const updates = {
      quantity: 15,
      total_amount: 1500,
      notes: 'Updated test transaction'
    };
    
    const updated = await transactionsAPI.updateTransaction(testTransactionId, updates);
    expect(updated.quantity).toBe(updates.quantity);
    expect(updated.total_amount).toBe(updates.total_amount);
    expect(updated.notes).toBe(updates.notes);
  });

  it('should subscribe to transaction changes', async () => {
    return new Promise<void>((resolve, reject) => {
      const subscription = transactionsAPI.subscribeToTransactions((payload) => {
        try {
          expect(payload).toHaveProperty('eventType');
          expect(payload).toHaveProperty('new');
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          subscription.unsubscribe();
        }
      });

      // Trigger an update to test the subscription
      transactionsAPI.updateTransaction(testTransactionId, { notes: 'Testing subscription' })
        .catch(reject);
    });
  });
});
