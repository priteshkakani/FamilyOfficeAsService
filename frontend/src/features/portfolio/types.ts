export interface Asset {
  id: string;
  name: string;
  type: 'stock' | 'mutual_fund' | 'etf' | 'bond' | 'real_estate' | 'other';
  ticker?: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  costBasis: number;
  gainLoss: number;
  gainLossPercentage: number;
  sector?: string;
  lastUpdated: string;
  notes?: string;
}

export interface PortfolioSummary {
  totalValue: number;
  costBasis: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  assetAllocation: Array<{
    type: string;
    value: number;
    percentage: number;
  }>;
  sectorAllocation?: Array<{
    sector: string;
    value: number;
    percentage: number;
  }>;
}

export interface PortfolioState {
  assets: Asset[];
  summary: PortfolioSummary;
  loading: boolean;
  error: string | null;
}
