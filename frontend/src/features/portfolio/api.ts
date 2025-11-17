import { Asset, PortfolioSummary } from './types';

const API_BASE_URL = '/api/portfolio';

export const fetchPortfolio = async (): Promise<{
  assets: Asset[];
  summary: PortfolioSummary;
}> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch portfolio');
  }
  return response.json();
};

export const addAsset = async (asset: Omit<Asset, 'id' | 'lastUpdated' | 'totalValue' | 'gainLoss' | 'gainLossPercentage'>): Promise<Asset> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(asset),
  });
  if (!response.ok) {
    throw new Error('Failed to add asset');
  }
  return response.json();
};

export const updateAsset = async (id: string, updates: Partial<Asset>): Promise<Asset> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update asset');
  }
  return response.json();
};

export const deleteAsset = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete asset');
  }
};

export const refreshPrices = async (): Promise<{
  assets: Asset[];
  summary: PortfolioSummary;
}> => {
  const response = await fetch(`${API_BASE_URL}/refresh-prices`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to refresh prices');
  }
  return response.json();
};
