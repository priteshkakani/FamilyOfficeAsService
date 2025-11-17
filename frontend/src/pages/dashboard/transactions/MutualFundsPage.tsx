import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Plus, 
  Filter, 
  ArrowUpDown, 
  ChevronDown, 
  MoreHorizontal, 
  TrendingUp, 
  TrendingDown, 
  ArrowRightLeft,
  Download,
  Upload,
  RefreshCw,
  BarChart2,
  PieChart,
  LineChart,
  Info,
  Star,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Percent,
  Hash,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus as PlusIcon
} from 'lucide-react';

type MutualFund = {
  id: string;
  name: string;
  ticker: string;
  category: string;
  nav: number;
  navDate: string;
  change: {
    value: number;
    percent: number;
  };
  aum: number;
  expenseRatio: number;
  riskLevel: 'Low' | 'Low to Moderate' | 'Moderate' | 'Moderately High' | 'High';
  rating: 1 | 2 | 3 | 4 | 5;
  morningstarRating?: number;
  minInvestment: number;
  ytdReturn: number;
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  sinceInceptionReturn: number;
  sectorAllocation: {
    sector: string;
    percentage: number;
  }[];
  topHoldings: {
    name: string;
    symbol: string;
    percentage: number;
  }[];
  tags: string[];
  isFavorite: boolean;
};

const mockMutualFunds: MutualFund[] = [
  {
    id: 'MF-001',
    name: 'Vanguard Total Stock Market Index',
    ticker: 'VTSAX',
    category: 'Large Blend',
    nav: 105.67,
    navDate: '2023-11-14',
    change: {
      value: 1.23,
      percent: 1.18
    },
    aum: 125000000000,
    expenseRatio: 0.04,
    riskLevel: 'Moderate',
    rating: 5,
    morningstarRating: 5,
    minInvestment: 3000,
    ytdReturn: 8.5,
    oneYearReturn: 12.3,
    threeYearReturn: 9.8,
    fiveYearReturn: 11.2,
    sinceInceptionReturn: 7.9,
    sectorAllocation: [
      { sector: 'Technology', percentage: 25.3 },
      { sector: 'Healthcare', percentage: 14.2 },
      { sector: 'Financial Services', percentage: 13.8 },
      { sector: 'Consumer Cyclical', percentage: 10.5 },
      { sector: 'Industrials', percentage: 9.1 },
      { sector: 'Other', percentage: 27.1 }
    ],
    topHoldings: [
      { name: 'Apple Inc', symbol: 'AAPL', percentage: 6.2 },
      { name: 'Microsoft Corp', symbol: 'MSFT', percentage: 5.8 },
      { name: 'Amazon.com Inc', symbol: 'AMZN', percentage: 3.1 },
      { name: 'NVIDIA Corp', symbol: 'NVDA', percentage: 2.9 },
      { name: 'Alphabet Inc Class A', symbol: 'GOOGL', percentage: 2.1 }
    ],
    tags: ['Index Fund', 'Low Cost', 'Diversified', 'Large Cap'],
    isFavorite: true
  },
  {
    id: 'MF-002',
    name: 'Fidelity 500 Index Fund',
    ticker: 'FXAIX',
    category: 'Large Blend',
    nav: 156.78,
    navDate: '2023-11-14',
    change: {
      value: 0.89,
      percent: 0.57
    },
    aum: 35000000000,
    expenseRatio: 0.015,
    riskLevel: 'Moderate',
    rating: 5,
    morningstarRating: 5,
    minInvestment: 0,
    ytdReturn: 8.2,
    oneYearReturn: 11.9,
    threeYearReturn: 9.5,
    fiveYearReturn: 10.8,
    sinceInceptionReturn: 7.8,
    sectorAllocation: [
      { sector: 'Technology', percentage: 28.1 },
      { sector: 'Healthcare', percentage: 13.5 },
      { sector: 'Financial Services', percentage: 12.9 },
      { sector: 'Consumer Cyclical', percentage: 10.1 },
      { sector: 'Industrials', percentage: 8.7 },
      { sector: 'Other', percentage: 26.7 }
    ],
    topHoldings: [
      { name: 'Apple Inc', symbol: 'AAPL', percentage: 7.1 },
      { name: 'Microsoft Corp', symbol: 'MSFT', percentage: 6.8 },
      { name: 'Amazon.com Inc', symbol: 'AMZN', percentage: 3.5 },
      { name: 'NVIDIA Corp', symbol: 'NVDA', percentage: 3.2 },
      { name: 'Alphabet Inc Class A', symbol: 'GOOGL', percentage: 2.3 }
    ],
    tags: ['Index Fund', 'S&P 500', 'Low Cost', 'Large Cap'],
    isFavorite: true
  },
  {
    id: 'MF-003',
    name: 'T. Rowe Price Blue Chip Growth',
    ticker: 'TRBCX',
    category: 'Large Growth',
    nav: 145.32,
    navDate: '2023-11-14',
    change: {
      value: -0.67,
      percent: -0.46
    },
    aum: 85000000000,
    expenseRatio: 0.69,
    riskLevel: 'Moderately High',
    rating: 4,
    morningstarRating: 4,
    minInvestment: 2500,
    ytdReturn: 15.2,
    oneYearReturn: 18.7,
    threeYearReturn: 12.4,
    fiveYearReturn: 14.9,
    sinceInceptionReturn: 10.2,
    sectorAllocation: [
      { sector: 'Technology', percentage: 42.3 },
      { sector: 'Healthcare', percentage: 18.7 },
      { sector: 'Consumer Cyclical', percentage: 15.2 },
      { sector: 'Communication Services', percentage: 12.8 },
      { sector: 'Other', percentage: 11.0 }
    ],
    topHoldings: [
      { name: 'Microsoft Corp', symbol: 'MSFT', percentage: 9.5 },
      { name: 'Apple Inc', symbol: 'AAPL', percentage: 8.9 },
      { name: 'Amazon.com Inc', symbol: 'AMZN', percentage: 7.2 },
      { name: 'NVIDIA Corp', symbol: 'NVDA', percentage: 6.8 },
      { name: 'Alphabet Inc Class A', symbol: 'GOOGL', percentage: 5.4 }
    ],
    tags: ['Growth', 'Large Cap', 'Tech Heavy'],
    isFavorite: false
  },
  {
    id: 'MF-004',
    name: 'Dodge & Cox Income Fund',
    ticker: 'DODIX',
    category: 'Intermediate Core-Plus Bond',
    nav: 13.45,
    navDate: '2023-11-14',
    change: {
      value: 0.03,
      percent: 0.22
    },
    aum: 75000000000,
    expenseRatio: 0.42,
    riskLevel: 'Low to Moderate',
    rating: 4,
    morningstarRating: 4,
    minInvestment: 2500,
    ytdReturn: 2.1,
    oneYearReturn: 3.8,
    threeYearReturn: -1.2,
    fiveYearReturn: 2.3,
    sinceInceptionReturn: 5.7,
    sectorAllocation: [
      { sector: 'Corporate Bond', percentage: 42.5 },
      { sector: 'US Government', percentage: 28.7 },
      { sector: 'Securitized', percentage: 15.3 },
      { sector: 'Cash & Equivalents', percentage: 8.2 },
      { sector: 'Other', percentage: 5.3 }
    ],
    topHoldings: [
      { name: 'US Treasury Note', symbol: 'UST', percentage: 8.2 },
      { name: 'Fannie Mae', symbol: 'FNMA', percentage: 3.5 },
      { name: 'Bank of America Corp', symbol: 'BAC', percentage: 2.8 },
      { name: 'JPMorgan Chase & Co', symbol: 'JPM', percentage: 2.6 },
      { name: 'Goldman Sachs Group Inc', symbol: 'GS', percentage: 2.3 }
    ],
    tags: ['Bond', 'Income', 'Low Volatility'],
    isFavorite: false
  },
  {
    id: 'MF-005',
    name: 'Vanguard Total International Stock Index',
    ticker: 'VTIAX',
    category: 'Foreign Large Blend',
    nav: 18.76,
    navDate: '2023-11-14',
    change: {
      value: 0.12,
      percent: 0.64
    },
    aum: 45000000000,
    expenseRatio: 0.11,
    riskLevel: 'Moderate',
    rating: 4,
    morningstarRating: 4,
    minInvestment: 3000,
    ytdReturn: 5.8,
    oneYearReturn: 8.2,
    threeYearReturn: 4.1,
    fiveYearReturn: 5.7,
    sinceInceptionReturn: 4.9,
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 17.8 },
      { sector: 'Industrials', percentage: 14.2 },
      { sector: 'Consumer Cyclical', percentage: 12.5 },
      { sector: 'Healthcare', percentage: 10.8 },
      { sector: 'Technology', percentage: 9.7 },
      { sector: 'Other', percentage: 35.0 }
    ],
    topHoldings: [
      { name: 'Taiwan Semiconductor', symbol: 'TSM', percentage: 2.8 },
      { name: 'Nestle SA', symbol: 'NSRGY', percentage: 1.9 },
      { name: 'ASML Holding NV', symbol: 'ASML', percentage: 1.7 },
      { name: 'Samsung Electronics', symbol: '005930.KS', percentage: 1.6 },
      { name: 'Novo Nordisk A/S', symbol: 'NVO', percentage: 1.4 }
    ],
    tags: ['International', 'Diversified', 'Emerging Markets'],
    isFavorite: true
  },
  {
    id: 'MF-006',
    name: 'Fidelity Contrafund',
    ticker: 'FCNTX',
    category: 'Large Growth',
    nav: 17.89,
    navDate: '2023-11-14',
    change: {
      value: -0.23,
      percent: -1.27
    },
    aum: 125000000000,
    expenseRatio: 0.86,
    riskLevel: 'Moderately High',
    rating: 4,
    morningstarRating: 4,
    minInvestment: 0,
    ytdReturn: 12.5,
    oneYearReturn: 16.8,
    threeYearReturn: 10.2,
    fiveYearReturn: 13.5,
    sinceInceptionReturn: 12.1,
    sectorAllocation: [
      { sector: 'Technology', percentage: 38.5 },
      { sector: 'Consumer Cyclical', percentage: 18.2 },
      { sector: 'Healthcare', percentage: 15.7 },
      { sector: 'Communication Services', percentage: 12.3 },
      { sector: 'Other', percentage: 15.3 }
    ],
    topHoldings: [
      { name: 'Microsoft Corp', symbol: 'MSFT', percentage: 10.2 },
      { name: 'Alphabet Inc Class A', symbol: 'GOOGL', percentage: 8.7 },
      { name: 'Amazon.com Inc', symbol: 'AMZN', percentage: 7.9 },
      { name: 'NVIDIA Corp', symbol: 'NVDA', percentage: 6.5 },
      { name: 'Tesla Inc', symbol: 'TSLA', percentage: 5.8 }
    ],
    tags: ['Growth', 'Large Cap', 'Blue Chip'],
    isFavorite: false
  },
  {
    id: 'MF-007',
    name: 'American Funds Growth Fund of America',
    ticker: 'AGTHX',
    category: 'Large Growth',
    nav: 56.34,
    navDate: '2023-11-14',
    change: {
      value: 0.45,
      percent: 0.81
    },
    aum: 250000000000,
    expenseRatio: 0.62,
    riskLevel: 'Moderately High',
    rating: 4,
    morningstarRating: 4,
    minInvestment: 250,
    ytdReturn: 14.2,
    oneYearReturn: 17.5,
    threeYearReturn: 11.8,
    fiveYearReturn: 14.2,
    sinceInceptionReturn: 12.8,
    sectorAllocation: [
      { sector: 'Technology', percentage: 36.7 },
      { sector: 'Healthcare', percentage: 16.8 },
      { sector: 'Consumer Cyclical', percentage: 15.2 },
      { sector: 'Financial Services', percentage: 12.4 },
      { sector: 'Other', percentage: 18.9 }
    ],
    topHoldings: [
      { name: 'Microsoft Corp', symbol: 'MSFT', percentage: 8.9 },
      { name: 'Amazon.com Inc', symbol: 'AMZN', percentage: 7.5 },
      { name: 'Alphabet Inc Class A', symbol: 'GOOGL', percentage: 6.8 },
      { name: 'Tesla Inc', symbol: 'TSLA', percentage: 5.6 },
      { name: 'NVIDIA Corp', symbol: 'NVDA', percentage: 5.2 }
    ],
    tags: ['Growth', 'Large Cap', 'Blue Chip'],
    isFavorite: true
  },
  {
    id: 'MF-008',
    name: 'T. Rowe Price Dividend Growth',
    ticker: 'PRDGX',
    category: 'Large Value',
    nav: 34.21,
    navDate: '2023-11-14',
    change: {
      value: 0.12,
      percent: 0.35
    },
    aum: 45000000000,
    expenseRatio: 0.64,
    riskLevel: 'Moderate',
    rating: 4,
    morningstarRating: 4,
    minInvestment: 2500,
    ytdReturn: 6.8,
    oneYearReturn: 9.2,
    threeYearReturn: 7.5,
    fiveYearReturn: 9.8,
    sinceInceptionReturn: 8.7,
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 22.5 },
      { sector: 'Healthcare', percentage: 18.7 },
      { sector: 'Industrials', percentage: 15.3 },
      { sector: 'Technology', percentage: 14.8 },
      { sector: 'Consumer Defensive', percentage: 10.2 },
      { sector: 'Other', percentage: 18.5 }
    ],
    topHoldings: [
      { name: 'JPMorgan Chase & Co', symbol: 'JPM', percentage: 5.6 },
      { name: 'Microsoft Corp', symbol: 'MSFT', percentage: 5.2 },
      { name: 'Johnson & Johnson', symbol: 'JNJ', percentage: 4.8 },
      { name: 'Procter & Gamble Co', symbol: 'PG', percentage: 4.5 },
      { name: 'Visa Inc Class A', symbol: 'V', percentage: 4.2 }
    ],
    tags: ['Dividend', 'Value', 'Income'],
    isFavorite: false
  },
  {
    id: 'MF-009',
    name: 'Vanguard Health Care Fund',
    ticker: 'VGHAX',
    category: 'Health',
    nav: 245.67,
    navDate: '2023-11-14',
    change: {
      value: -1.23,
      percent: -0.50
    },
    aum: 65000000000,
    expenseRatio: 0.34,
    riskLevel: 'Moderately High',
    rating: 4,
    morningstarRating: 4,
    minInvestment: 3000,
    ytdReturn: 3.2,
    oneYearReturn: 5.7,
    threeYearReturn: 8.4,
    fiveYearReturn: 10.2,
    sinceInceptionReturn: 12.5,
    sectorAllocation: [
      { sector: 'Pharmaceuticals', percentage: 42.5 },
      { sector: 'Biotechnology', percentage: 28.7 },
      { sector: 'Healthcare Equipment', percentage: 15.3 },
      { sector: 'Healthcare Services', percentage: 8.2 },
      { sector: 'Other', percentage: 5.3 }
    ],
    topHoldings: [
      { name: 'UnitedHealth Group Inc', symbol: 'UNH', percentage: 9.8 },
      { name: 'Eli Lilly and Co', symbol: 'LLY', percentage: 8.5 },
      { name: 'Johnson & Johnson', symbol: 'JNJ', percentage: 7.9 },
      { name: 'Pfizer Inc', symbol: 'PFE', percentage: 6.7 },
      { name: 'AbbVie Inc', symbol: 'ABBV', percentage: 6.2 }
    ],
    tags: ['Sector', 'Healthcare', 'Growth'],
    isFavorite: false
  },
  {
    id: 'MF-010',
    name: 'Fidelity Real Estate Investment Portfolio',
    ticker: 'FRESX',
    category: 'Real Estate',
    nav: 12.34,
    navDate: '2023-11-14',
    change: {
      value: 0.23,
      percent: 1.90
    },
    aum: 28000000000,
    expenseRatio: 0.69,
    riskLevel: 'Moderate',
    rating: 3,
    morningstarRating: 3,
    minInvestment: 0,
    ytdReturn: 2.5,
    oneYearReturn: 4.8,
    threeYearReturn: 5.2,
    fiveYearReturn: 6.8,
    sinceInceptionReturn: 8.3,
    sectorAllocation: [
      { sector: 'Specialized REITs', percentage: 35.2 },
      { sector: 'Retail REITs', percentage: 22.7 },
      { sector: 'Residential REITs', percentage: 18.5 },
      { sector: 'Office REITs', percentage: 12.3 },
      { sector: 'Other', percentage: 11.3 }
    ],
    topHoldings: [
      { name: 'Prologis Inc', symbol: 'PLD', percentage: 8.7 },
      { name: 'American Tower Corp', symbol: 'AMT', percentage: 7.9 },
      { name: 'Crown Castle International Corp', symbol: 'CCI', percentage: 6.5 },
      { name: 'Equinix Inc', symbol: 'EQIX', percentage: 5.8 },
      { name: 'Digital Realty Trust Inc', symbol: 'DLR', percentage: 5.2 }
    ],
    tags: ['REIT', 'Real Estate', 'Income'],
    isFavorite: false
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatLargeNumber = (num: number) => {
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(1)}B`;
  }
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  }
  return formatCurrency(num);
};

const formatPercent = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'Low':
      return 'bg-green-100 text-green-800';
    case 'Low to Moderate':
      return 'bg-blue-100 text-blue-800';
    case 'Moderate':
      return 'bg-yellow-100 text-yellow-800';
    case 'Moderately High':
      return 'bg-orange-100 text-orange-800';
    case 'High':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function MutualFundsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>([]);
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'name', 
    direction: 'asc' 
  });

  const categories = [...new Set(mockMutualFunds.map(fund => fund.category))];
  const riskLevels = ['Low', 'Low to Moderate', 'Moderate', 'Moderately High', 'High'];

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFunds(filteredFunds.map(fund => fund.id));
    } else {
      setSelectedFunds([]);
    }
  };

  const toggleSelectFund = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedFunds([...selectedFunds, id]);
    } else {
      setSelectedFunds(selectedFunds.filter(fundId => fundId !== id));
    }
  };

  const toggleRiskLevel = (level: string) => {
    if (selectedRiskLevels.includes(level)) {
      setSelectedRiskLevels(selectedRiskLevels.filter(l => l !== level));
    } else {
      setSelectedRiskLevels([...selectedRiskLevels, level]);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredFunds = mockMutualFunds
    .filter(fund => {
      const matchesSearch = 
        fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fund.ticker.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'all' || 
        fund.category === selectedCategory;
      
      const matchesRiskLevel = 
        selectedRiskLevels.length === 0 || 
        selectedRiskLevels.includes(fund.riskLevel);
      
      const matchesTab = 
        activeTab === 'all' ||
        (activeTab === 'favorites' && fund.isFavorite) ||
        (activeTab === 'largeCap' && fund.tags?.includes('Large Cap')) ||
        (activeTab === 'growth' && fund.tags?.includes('Growth')) ||
        (activeTab === 'income' && (fund.tags?.includes('Income') || fund.tags?.includes('Dividend'))) ||
        (activeTab === 'index' && fund.tags?.includes('Index Fund'));
      
      return matchesSearch && matchesCategory && matchesRiskLevel && matchesTab;
    })
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.key) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'ticker':
          aValue = a.ticker;
          bValue = b.ticker;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'nav':
          aValue = a.nav;
          bValue = b.nav;
          break;
        case 'change':
          aValue = a.change.percent;
          bValue = b.change.percent;
          break;
        case 'aum':
          aValue = a.aum;
          bValue = b.aum;
          break;
        case 'expenseRatio':
          aValue = a.expenseRatio;
          bValue = b.expenseRatio;
          break;
        case 'ytdReturn':
          aValue = a.ytdReturn;
          bValue = b.ytdReturn;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const getSortIndicator = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mutual Funds</h1>
          <p className="text-muted-foreground">Explore and manage your mutual fund investments</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Investment
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockMutualFunds.length}</p>
            <p className="text-sm text-muted-foreground">across all categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Return (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {(
                mockMutualFunds.reduce((sum, fund) => sum + fund.ytdReturn, 0) / mockMutualFunds.length
              ).toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground">year to date</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatLargeNumber(
                mockMutualFunds.reduce((sum, fund) => sum + fund.aum, 0)
              )}
            </p>
            <p className="text-sm text-muted-foreground">assets under management</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Expense Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(
                mockMutualFunds.reduce((sum, fund) => sum + fund.expenseRatio, 0) / mockMutualFunds.length
              ).toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground">weighted average</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="all">All Funds</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="largeCap">Large Cap</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="index">Index Funds</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search funds..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Category</h4>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Risk Level</h4>
                  <div className="space-y-2">
                    {riskLevels.map(level => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`risk-${level}`}
                          checked={selectedRiskLevels.includes(level)}
                          onCheckedChange={() => toggleRiskLevel(level)}
                        />
                        <label 
                          htmlFor={`risk-${level}`} 
                          className="text-sm"
                        >
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedRiskLevels([]);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <TabsContent value={activeTab} className="space-y-4">
          {selectedFunds.length > 0 && (
            <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedFunds.length === filteredFunds.length && filteredFunds.length > 0}
                  onCheckedChange={(checked) => toggleSelectAll(checked as boolean)}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  {selectedFunds.length} {selectedFunds.length === 1 ? 'fund' : 'funds'} selected
                </label>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => console.log('Compare selected funds')}
                >
                  <BarChart2 className="h-4 w-4 mr-1" /> Compare
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => console.log('Remove selected funds')}
                >
                  <XCircle className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>
            </div>
          )}
          
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      id="select-all-header"
                      checked={selectedFunds.length === filteredFunds.length && filteredFunds.length > 0}
                      onCheckedChange={(checked) => toggleSelectAll(checked as boolean)}
                      disabled={filteredFunds.length === 0}
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Fund Name {getSortIndicator('name')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleSort('ticker')}
                  >
                    <div className="flex items-center">
                      Ticker {getSortIndicator('ticker')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center">
                      Category {getSortIndicator('category')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:text-primary"
                    onClick={() => handleSort('nav')}
                  >
                    <div className="flex justify-end items-center">
                      NAV {getSortIndicator('nav')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:text-primary"
                    onClick={() => handleSort('change')}
                  >
                    <div className="flex justify-end items-center">
                      Change {getSortIndicator('change')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:text-primary"
                    onClick={() => handleSort('aum')}
                  >
                    <div className="flex justify-end items-center">
                      AUM {getSortIndicator('aum')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:text-primary"
                    onClick={() => handleSort('expenseRatio')}
                  >
                    <div className="flex justify-end items-center">
                      Expense Ratio {getSortIndicator('expenseRatio')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:text-primary"
                    onClick={() => handleSort('ytdReturn')}
                  >
                    <div className="flex justify-end items-center">
                      YTD Return {getSortIndicator('ytdReturn')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFunds.length > 0 ? (
                  filteredFunds.map((fund) => (
                    <TableRow key={fund.id} className="group">
                      <TableCell>
                        <Checkbox
                          checked={selectedFunds.includes(fund.id)}
                          onCheckedChange={(checked) => 
                            toggleSelectFund(fund.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium flex items-center">
                          <button 
                            className={`mr-2 ${fund.isFavorite ? 'text-yellow-500' : 'text-muted-foreground/30 hover:text-yellow-500'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Toggle favorite status
                              console.log('Toggle favorite:', fund.id);
                            }}
                          >
                            <Star 
                              className={`h-4 w-4 ${fund.isFavorite ? 'fill-current' : ''}`} 
                            />
                          </button>
                          {fund.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">{fund.ticker}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">{fund.category}</div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(fund.nav)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={`flex items-center justify-end ${fund.change.percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {fund.change.percent >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 mr-0.5" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 mr-0.5" />
                          )}
                          {Math.abs(fund.change.percent).toFixed(2)}%
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatLargeNumber(fund.aum)}
                      </TableCell>
                      <TableCell className="text-right">
                        {fund.expenseRatio}%
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={`font-medium ${fund.ytdReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {fund.ytdReturn >= 0 ? '+' : ''}{fund.ytdReturn}%
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <BarChart2 className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <PieChartIcon className="h-4 w-4 mr-2" />
                              Analyze
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ArrowRightLeft className="h-4 w-4 mr-2" />
                              Trade
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <DollarSign className="h-4 w-4 mr-2" />
                              Add to Watchlist
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center py-8">
                        <BarChart2 className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No funds found</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Try adjusting your search or filter to find what you're looking for.
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                            setSelectedRiskLevels([]);
                            setActiveTab('all');
                          }}
                        >
                          Clear filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Showing <span className="font-medium">{filteredFunds.length}</span> of{' '}
              <span className="font-medium">{mockMutualFunds.length}</span> funds
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Fund Detail View - Would be a modal or separate page in a real app */}
      {filteredFunds.length === 1 && searchQuery && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">
                  {filteredFunds[0].name} <span className="text-muted-foreground">({filteredFunds[0].ticker})</span>
                </CardTitle>
                <CardDescription className="mt-1">
                  {filteredFunds[0].category} • {filteredFunds[0].riskLevel} Risk • 
                  <span className="ml-1">
                    {Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 inline ${i < filteredFunds[0].rating ? 'text-yellow-500 fill-current' : 'text-muted-foreground/30'}`} 
                      />
                    ))}
                    {filteredFunds[0].morningstarRating && (
                      <span className="ml-2 text-amber-600">
                        ★ {filteredFunds[0].morningstarRating} Morningstar
                      </span>
                    )}
                  </span>
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Invest
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Analyze
                </Button>
                <Button variant="outline" size="icon">
                  <Star className={`h-4 w-4 ${filteredFunds[0].isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">NAV</p>
                    <p className="text-xl font-semibold">{formatCurrency(filteredFunds[0].nav)}</p>
                    <p className={`text-sm ${filteredFunds[0].change.percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {filteredFunds[0].change.percent >= 0 ? '+' : ''}{filteredFunds[0].change.percent.toFixed(2)}% 
                      ({filteredFunds[0].change.value >= 0 ? '+' : ''}{filteredFunds[0].change.value.toFixed(2)})
                    </p>
                    <p className="text-xs text-muted-foreground">As of {formatDate(filteredFunds[0].navDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">AUM</p>
                    <p className="text-xl font-semibold">{formatLargeNumber(filteredFunds[0].aum)}</p>
                    <p className="text-xs text-muted-foreground">Total Assets</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Expense Ratio</p>
                    <p className="text-xl font-semibold">{filteredFunds[0].expenseRatio}%</p>
                    <p className="text-xs text-muted-foreground">
                      {filteredFunds[0].expenseRatio < 0.5 ? 'Low' : filteredFunds[0].expenseRatio < 1 ? 'Average' : 'High'} cost
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Minimum Investment</p>
                    <p className="text-xl font-semibold">{formatCurrency(filteredFunds[0].minInvestment)}</p>
                    <p className="text-xs text-muted-foreground">Initial minimum</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Performance</h3>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-1 text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">YTD Return</p>
                      <p className={`text-lg font-semibold ${filteredFunds[0].ytdReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {filteredFunds[0].ytdReturn >= 0 ? '+' : ''}{filteredFunds[0].ytdReturn}%
                      </p>
                    </div>
                    <div className="space-y-1 text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">1-Year Return</p>
                      <p className={`text-lg font-semibold ${filteredFunds[0].oneYearReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {filteredFunds[0].oneYearReturn >= 0 ? '+' : ''}{filteredFunds[0].oneYearReturn}%
                      </p>
                    </div>
                    <div className="space-y-1 text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">3-Year Return</p>
                      <p className={`text-lg font-semibold ${filteredFunds[0].threeYearReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {filteredFunds[0].threeYearReturn >= 0 ? '+' : ''}{filteredFunds[0].threeYearReturn}%
                      </p>
                    </div>
                    <div className="space-y-1 text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">5-Year Return</p>
                      <p className={`text-lg font-semibold ${filteredFunds[0].fiveYearReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {filteredFunds[0].fiveYearReturn >= 0 ? '+' : ''}{filteredFunds[0].fiveYearReturn}%
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Sector Allocation</h3>
                  <div className="space-y-2">
                    {filteredFunds[0].sectorAllocation.map((sector) => (
                      <div key={sector.sector} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{sector.sector}</span>
                          <span className="font-medium">{sector.percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={sector.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Holdings</CardTitle>
                    <CardDescription>As of latest reporting period</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {filteredFunds[0].topHoldings.map((holding, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{holding.name}</p>
                          <p className="text-sm text-muted-foreground">{holding.symbol}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{holding.percentage}%</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency((holding.percentage / 100) * filteredFunds[0].aum * 1000000)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-2">
                      View All Holdings
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Fund Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Risk Level</p>
                      <div className="flex items-center">
                        <div className={`px-2 py-1 rounded-md text-xs font-medium ${getRiskColor(filteredFunds[0].riskLevel)}`}>
                          {filteredFunds[0].riskLevel}
                        </div>
                        <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {filteredFunds[0].tags.map((tag, i) => (
                          <Badge key={i} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Morningstar Category</p>
                      <p>{filteredFunds[0].category}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Inception Date</p>
                      <p>Jan 1, 2010</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Manager Tenure</p>
                      <p>8.5 years</p>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Fact Sheet
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
