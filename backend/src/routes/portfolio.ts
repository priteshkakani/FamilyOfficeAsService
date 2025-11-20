import { Router } from 'express';
import { z } from 'zod';
import { db } from '../lib/supabase';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Zod schemas for request validation
const assetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['stock', 'mutual_fund', 'etf', 'bond', 'real_estate', 'other']),
  ticker: z.string().optional(),
  quantity: z.number().min(0, 'Quantity must be positive'),
  avgPrice: z.number().min(0, 'Average price must be positive'),
  currentPrice: z.number().min(0, 'Current price must be positive'),
  sector: z.string().optional(),
  notes: z.string().optional(),
});

// Get portfolio summary and assets
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all assets for the user
    const { data: assets, error: assetsError } = await db
      .from('assets')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (assetsError) throw assetsError;

    // Calculate portfolio summary
    const totalValue = assets.reduce((sum, asset) => sum + (asset.currentPrice * asset.quantity), 0);
    const costBasis = assets.reduce((sum, asset) => sum + (asset.avgPrice * asset.quantity), 0);
    const totalGainLoss = totalValue - costBasis;
    const totalGainLossPercentage = costBasis > 0 ? (totalGainLoss / costBasis) * 100 : 0;

    // Calculate asset allocation by type
    const assetAllocation = assets.reduce((acc, asset) => {
      const value = asset.currentPrice * asset.quantity;
      const existing = acc.find(a => a.type === asset.type);

      if (existing) {
        existing.value += value;
      } else {
        acc.push({
          type: asset.type,
          value,
          percentage: 0 // Will be calculated after
        });
      }
      return acc;
    }, [] as Array<{ type: string; value: number; percentage: number }>);

    // Calculate percentages
    assetAllocation.forEach(item => {
      item.percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
    });

    // Prepare response
    const summary = {
      totalValue,
      costBasis,
      totalGainLoss,
      totalGainLossPercentage,
      assetAllocation,
    };

    res.json({ assets, summary });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// Add new asset
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const validation = assetSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const assetData = validation.data;
    const currentPrice = assetData.currentPrice || assetData.avgPrice;
    const totalValue = currentPrice * assetData.quantity;
    const costBasis = assetData.avgPrice * assetData.quantity;
    const gainLoss = totalValue - costBasis;
    const gainLossPercentage = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

    const { data: asset, error } = await db
      .from('assets')
      .insert([
        {
          ...assetData,
          user_id: userId,
          current_price: currentPrice,
          total_value: totalValue,
          cost_basis: costBasis,
          gain_loss: gainLoss,
          gain_loss_percentage: gainLossPercentage,
          last_updated: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(asset);
  } catch (error) {
    console.error('Error adding asset:', error);
    res.status(500).json({ error: 'Failed to add asset' });
  }
});

// Update asset
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const validation = assetSchema.partial().safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    // Get current asset
    const { data: currentAsset, error: fetchError } = await db
      .from('assets')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;
    if (!currentAsset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Update asset
    const updatedFields = validation.data;
    const updatedAsset = { ...currentAsset, ...updatedFields };

    // Recalculate derived fields if necessary
    if (updatedFields.quantity !== undefined || updatedFields.currentPrice !== undefined) {
      updatedAsset.total_value = updatedAsset.current_price * updatedAsset.quantity;
      updatedAsset.cost_basis = updatedAsset.avg_price * updatedAsset.quantity;
      updatedAsset.gain_loss = updatedAsset.total_value - updatedAsset.cost_basis;
      updatedAsset.gain_loss_percentage = updatedAsset.cost_basis > 0
        ? (updatedAsset.gain_loss / updatedAsset.cost_basis) * 100
        : 0;
    }

    const { data: asset, error } = await db
      .from('assets')
      .update({
        ...updatedFields,
        last_updated: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json(asset);
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({ error: 'Failed to update asset' });
  }
});

// Delete asset
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { error } = await db
      .from('assets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

// Refresh asset prices
router.post('/refresh-prices', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all user's assets
    const { data: assets, error: fetchError } = await db
      .from('assets')
      .select('*')
      .eq('user_id', userId);

    if (fetchError) throw fetchError;

    // In a real app, you would fetch current prices from a financial data API here
    // For now, we'll just update the timestamp to simulate a refresh
    const updatedAssets = await Promise.all(
      assets.map(async (asset) => {
        // Simulate price change (in a real app, fetch from an API)
        const priceChange = (Math.random() * 10 - 5) / 100; // Random change between -5% and +5%
        const currentPrice = asset.current_price * (1 + priceChange);
        const totalValue = currentPrice * asset.quantity;
        const gainLoss = totalValue - asset.cost_basis;
        const gainLossPercentage = asset.cost_basis > 0
          ? (gainLoss / asset.cost_basis) * 100
          : 0;

        const { data: updatedAsset, error } = await db
          .from('assets')
          .update({
            current_price: currentPrice,
            total_value: totalValue,
            gain_loss: gainLoss,
            gain_loss_percentage: gainLossPercentage,
            last_updated: new Date().toISOString(),
          })
          .eq('id', asset.id)
          .select()
          .single();

        if (error) throw error;
        return updatedAsset;
      })
    );

    // Return the updated portfolio
    const totalValue = updatedAssets.reduce((sum, asset) => sum + asset.total_value, 0);
    const costBasis = updatedAssets.reduce((sum, asset) => sum + asset.cost_basis, 0);
    const totalGainLoss = totalValue - costBasis;
    const totalGainLossPercentage = costBasis > 0 ? (totalGainLoss / costBasis) * 100 : 0;

    res.json({
      assets: updatedAssets,
      summary: {
        totalValue,
        costBasis,
        totalGainLoss,
        totalGainLossPercentage,
        // Note: assetAllocation would need to be recalculated here in a real app
      },
    });
  } catch (error) {
    console.error('Error refreshing prices:', error);
    res.status(500).json({ error: 'Failed to refresh prices' });
  }
});

// Bulk delete assets by name (case-insensitive)
router.delete('/purge-by-name', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const raw = (req.query.name || (req.body && (req.body as any).name) || 'Reliance Industries');
    const name = typeof raw === 'string' ? raw.trim() : String(raw);
    if (!name) return res.status(400).json({ error: 'name is required' });

    // Return deleted rows to count them
    const { data: deleted, error } = await db
      .from('assets')
      .delete()
      .eq('user_id', userId)
      .ilike('name', name)
      .select('id');

    if (error) throw error;
    res.json({ deletedCount: deleted?.length || 0, name });
  } catch (error) {
    console.error('Error purging assets by name:', error);
    res.status(500).json({ error: 'Failed to purge assets by name' });
  }
});

export default router;
