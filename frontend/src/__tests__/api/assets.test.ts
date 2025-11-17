import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import * as assetsAPI from '@/api/assets';

// Test data
const testMutualFund = {
  name: 'Test Mutual Fund',
  symbol: 'TMF',
  isin: 'TEST12345678',
  nav: 150.75,
  nav_date: new Date().toISOString(),
  investment_type: 'growth' as const,
  risk_level: 'moderate' as const,
  expense_ratio: 0.5,
  aum: 1000000,
  min_investment: 1000,
  exit_load: '1% if redeemed within 1 year',
  notes: 'Test mutual fund'
};

const testStock = {
  name: 'Test Stock',
  symbol: 'TST',
  exchange: 'NYSE',
  current_price: 125.50,
  quantity: 100,
  average_buy_price: 120.00,
  investment_value: 12000,
  current_value: 12550,
  profit_loss: 550,
  profit_loss_percentage: 4.58,
  notes: 'Test stock'
};

describe('Assets API', () => {
  let testMutualFundId: string;
  let testStockId: string;

  // Create test data before all tests
  beforeAll(async () => {
    // Create a test mutual fund
    const { data: mf, error: mfError } = await assetsAPI.createMutualFund(testMutualFund);
    if (mfError || !mf) {
      throw new Error(`Failed to create test mutual fund: ${mfError?.message}`);
    }
    testMutualFundId = mf.id;

    // Create a test stock
    const { data: stock, error: stockError } = await assetsAPI.createStock(testStock);
    if (stockError || !stock) {
      throw new Error(`Failed to create test stock: ${stockError?.message}`);
    }
    testStockId = stock.id;
  });

  // Clean up after all tests
  afterAll(async () => {
    if (testMutualFundId) {
      try {
        await assetsAPI.deleteMutualFund(testMutualFundId);
      } catch (error) {
        console.error('Error cleaning up test mutual fund:', error);
      }
    }
    
    if (testStockId) {
      try {
        await assetsAPI.deleteStock(testStockId);
      } catch (error) {
        console.error('Error cleaning up test stock:', error);
      }
    }
  });

  // Mutual Funds Tests
  describe('Mutual Funds', () => {
    it('should fetch all mutual funds', async () => {
      const funds = await assetsAPI.getMutualFunds();
      expect(Array.isArray(funds)).toBe(true);
      expect(funds.length).toBeGreaterThan(0);
    });

    it('should fetch a mutual fund by ID', async () => {
      const fund = await assetsAPI.getMutualFundById(testMutualFundId);
      expect(fund).toBeDefined();
      expect(fund?.id).toBe(testMutualFundId);
      expect(fund?.symbol).toBe(testMutualFund.symbol);
    });

    it('should update a mutual fund', async () => {
      const updates = {
        nav: 155.25,
        notes: 'Updated test mutual fund'
      };
      
      const updated = await assetsAPI.updateMutualFund(testMutualFundId, updates);
      expect(updated.nav).toBe(updates.nav);
      expect(updated.notes).toBe(updates.notes);
    });
  });

  // Stocks Tests
  describe('Stocks', () => {
    it('should fetch all stocks', async () => {
      const stocks = await assetsAPI.getStocks();
      expect(Array.isArray(stocks)).toBe(true);
      expect(stocks.length).toBeGreaterThan(0);
    });

    it('should fetch a stock by ID', async () => {
      const stock = await assetsAPI.getStockById(testStockId);
      expect(stock).toBeDefined();
      expect(stock?.id).toBe(testStockId);
      expect(stock?.symbol).toBe(testStock.symbol);
    });

    it('should update a stock', async () => {
      const updates = {
        current_price: 130.75,
        notes: 'Updated test stock'
      };
      
      const updated = await assetsAPI.updateStock(testStockId, updates);
      expect(updated.current_price).toBe(updates.current_price);
      expect(updated.notes).toBe(updates.notes);
      
      // Verify derived fields were updated
      expect(updated.current_value).toBe(updated.quantity * updates.current_price);
      expect(updated.profit_loss).toBe(updated.current_value - updated.investment_value);
    });
  });

  // Performance Summary Test
  it('should fetch asset performance summary', async () => {
    const summary = await assetsAPI.getAssetPerformanceSummary();
    
    expect(summary).toHaveProperty('total_investment');
    expect(summary).toHaveProperty('current_value');
    expect(summary).toHaveProperty('profit_loss');
    expect(summary).toHaveProperty('profit_loss_percentage');
    expect(Array.isArray(summary.by_asset_type)).toBe(true);
    
    // Verify the summary includes our test data
    const hasStocks = summary.by_asset_type.some(
      asset => asset.asset_type === 'Stocks' && asset.current_value > 0
    );
    
    const hasMutualFunds = summary.by_asset_type.some(
      asset => asset.asset_type === 'Mutual Funds' && asset.current_value > 0
    );
    
    expect(hasStocks || hasMutualFunds).toBe(true);
  });

  // Realtime Subscription Test
  it('should subscribe to asset changes', async () => {
    return new Promise<void>((resolve, reject) => {
      const subscription = assetsAPI.subscribeToAssets('stocks', (payload) => {
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
      assetsAPI.updateStock(testStockId, { notes: 'Testing subscription' })
        .catch(reject);
    });
  });
});
