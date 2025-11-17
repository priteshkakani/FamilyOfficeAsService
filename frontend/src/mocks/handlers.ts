import { rest } from 'msw';
import { v4 as uuidv4 } from 'uuid';
import { Asset, PortfolioSummary } from '../features/portfolio/types';

const generateMockAssets = (count = 10): Asset[] => {
  const types = ['stock', 'mutual_fund', 'etf', 'bond', 'real_estate', 'other'] as const;
  const sectors = ['Technology', 'Healthcare', 'Finance', 'Consumer', 'Industrial', 'Energy', 'Utilities'];
  const tickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'JPM', 'V', 'WMT', 'PG', 'JNJ'];
  
  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const quantity = Math.random() * 1000;
    const avgPrice = 10 + Math.random() * 1000;
    const currentPrice = avgPrice * (0.8 + Math.random() * 0.4); // Random price within ±20% of avg
    const totalValue = currentPrice * quantity;
    const costBasis = avgPrice * quantity;
    const gainLoss = totalValue - costBasis;
    const gainLossPercentage = (gainLoss / costBasis) * 100;

    return {
      id: uuidv4(),
      name: `${tickers[i % tickers.length]} ${type.replace('_', ' ').toUpperCase()}`,
      type,
      ticker: tickers[i % tickers.length],
      quantity: parseFloat(quantity.toFixed(4)),
      avgPrice: parseFloat(avgPrice.toFixed(2)),
      currentPrice: parseFloat(currentPrice.toFixed(2)),
      totalValue: parseFloat(totalValue.toFixed(2)),
      costBasis: parseFloat(costBasis.toFixed(2)),
      gainLoss: parseFloat(gainLoss.toFixed(2)),
      gainLossPercentage: parseFloat(gainLossPercentage.toFixed(2)),
      sector: sectors[Math.floor(Math.random() * sectors.length)],
      notes: `Test asset ${i + 1}`,
      lastUpdated: new Date().toISOString(),
    };
  });
};

const mockAssets = generateMockAssets(15);

const calculateSummary = (assets: Asset[]): PortfolioSummary => {
  const totalValue = assets.reduce((sum, asset) => sum + asset.totalValue, 0);
  const costBasis = assets.reduce((sum, asset) => sum + asset.costBasis, 0);
  const totalGainLoss = totalValue - costBasis;
  const totalGainLossPercentage = costBasis > 0 ? (totalGainLoss / costBasis) * 100 : 0;

  // Calculate asset allocation by type
  const assetAllocation = assets.reduce((acc, asset) => {
    const existing = acc.find((a) => a.type === asset.type);
    if (existing) {
      existing.value += asset.totalValue;
    } else {
      acc.push({
        type: asset.type,
        value: asset.totalValue,
        percentage: 0, // Will be calculated after
      });
    }
    return acc;
  }, [] as Array<{ type: string; value: number; percentage: number }>);

  // Calculate percentages
  assetAllocation.forEach((item) => {
    item.percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
  });

  return {
    totalValue: parseFloat(totalValue.toFixed(2)),
    costBasis: parseFloat(costBasis.toFixed(2)),
    totalGainLoss: parseFloat(totalGainLoss.toFixed(2)),
    totalGainLossPercentage: parseFloat(totalGainLossPercentage.toFixed(2)),
    assetAllocation,
  };
};

export const handlers = [
  // Get portfolio
  rest.get('/api/portfolio', (req, res, ctx) => {
    return res(
      ctx.delay(150), // Simulate network delay
      ctx.json({
        assets: mockAssets,
        summary: calculateSummary(mockAssets),
      })
    );
  }),

  // Add asset
  rest.post('/api/portfolio', async (req, res, ctx) => {
    const newAsset = await req.json();
    const asset: Asset = {
      ...newAsset,
      id: uuidv4(),
      lastUpdated: new Date().toISOString(),
      currentPrice: newAsset.currentPrice || newAsset.avgPrice,
      totalValue: (newAsset.currentPrice || newAsset.avgPrice) * newAsset.quantity,
      costBasis: newAsset.avgPrice * newAsset.quantity,
      gainLoss: (newAsset.currentPrice - newAsset.avgPrice) * newAsset.quantity,
      gainLossPercentage: newAsset.avgPrice > 0 
        ? ((newAsset.currentPrice - newAsset.avgPrice) / newAsset.avgPrice) * 100 
        : 0,
    };
    
    mockAssets.push(asset);
    return res(ctx.delay(150), ctx.json(asset));
  }),

  // Update asset
  rest.patch('/api/portfolio/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const updates = await req.json();
    const index = mockAssets.findIndex((a) => a.id === id);
    
    if (index === -1) {
      return res(ctx.status(404));
    }
    
    mockAssets[index] = { ...mockAssets[index], ...updates };
    return res(ctx.delay(150), ctx.json(mockAssets[index]));
  }),

  // Delete asset
  rest.delete('/api/portfolio/:id', (req, res, ctx) => {
    const { id } = req.params;
    const index = mockAssets.findIndex((a) => a.id === id);
    
    if (index === -1) {
      return res(ctx.status(404));
    }
    
    mockAssets.splice(index, 1);
    return res(ctx.delay(150), ctx.status(204));
  }),

  // Refresh prices
  rest.post('/api/portfolio/refresh-prices', (req, res, ctx) => {
    // Simulate price updates
    mockAssets.forEach((asset) => {
      const priceChange = (Math.random() * 10 - 5) / 100; // Random change between -5% and +5%
      asset.currentPrice = parseFloat((asset.currentPrice * (1 + priceChange)).toFixed(2));
      asset.totalValue = parseFloat((asset.currentPrice * asset.quantity).toFixed(2));
      asset.gainLoss = parseFloat((asset.totalValue - asset.costBasis).toFixed(2));
      asset.gainLossPercentage = asset.costBasis > 0 
        ? parseFloat(((asset.gainLoss / asset.costBasis) * 100).toFixed(2)) 
        : 0;
      asset.lastUpdated = new Date().toISOString();
    });
    
    return res(
      ctx.delay(300), // Simulate API delay
      ctx.json({
        assets: mockAssets,
        summary: calculateSummary(mockAssets),
      })
    );
  }),
];
