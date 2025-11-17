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
  Plus as PlusIcon,
  Trash2,
  ExternalLink,
  Bell,
  Share2,
  Copy,
  Eye,
  EyeOff,
  Tag,
  List,
  Grid,
  SlidersHorizontal
} from 'lucide-react';

type Stock = {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  price: number;
  change: {
    value: number;
    percent: number;
  };
  marketCap: number;
  volume: number;
  avgVolume: number;
  peRatio: number;
  dividendYield: number;
  yearHigh: number;
  yearLow: number;
  fiftyTwoWeekChange: number;
  beta: number;
  eps: number;
  earningsDate: string;
  isFavorite: boolean;
  isWatching: boolean;
  tags: string[];
  holdings?: {
    quantity: number;
    avgCost: number;
    totalCost: number;
    currentValue: number;
    pnl: number;
    pnlPercent: number;
  };
};

const mockStocks: Stock[] = [
  {
    id: 'AAPL',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    price: 189.37,
    change: {
      value: 2.15,
      percent: 1.15
    },
    marketCap: 2963000000000,
    volume: 48927300,
    avgVolume: 57954300,
    peRatio: 31.45,
    dividendYield: 0.51,
    yearHigh: 198.23,
    yearLow: 124.17,
    fiftyTwoWeekChange: 32.5,
    beta: 1.28,
    eps: 6.03,
    earningsDate: '2024-01-25',
    isFavorite: true,
    isWatching: true,
    tags: ['FAANG', 'Mega Cap', 'Dividend', 'Blue Chip'],
    holdings: {
      quantity: 25,
      avgCost: 165.42,
      totalCost: 4135.50,
      currentValue: 4734.25,
      pnl: 598.75,
      pnlPercent: 14.48
    }
  },
  {
    id: 'MSFT',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Software—Infrastructure',
    price: 374.51,
    change: {
      value: -1.23,
      percent: -0.33
    },
    marketCap: 2785000000000,
    volume: 18927300,
    avgVolume: 25432100,
    peRatio: 36.72,
    dividendYield: 0.80,
    yearHigh: 384.30,
    yearLow: 219.35,
    fiftyTwoWeekChange: 41.2,
    beta: 0.89,
    eps: 10.20,
    earningsDate: '2024-01-30',
    isFavorite: true,
    isWatching: true,
    tags: ['Cloud Computing', 'AI', 'Mega Cap', 'Blue Chip'],
    holdings: {
      quantity: 15,
      avgCost: 315.76,
      totalCost: 4736.40,
      currentValue: 5617.65,
      pnl: 881.25,
      pnlPercent: 18.61
    }
  },
  {
    id: 'GOOGL',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    exchange: 'NASDAQ',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    price: 138.45,
    change: {
      value: 0.87,
      percent: 0.63
    },
    marketCap: 1748000000000,
    volume: 25678900,
    avgVolume: 29876500,
    peRatio: 27.35,
    dividendYield: 0,
    yearHigh: 153.78,
    yearLow: 89.34,
    fiftyTwoWeekChange: 38.7,
    beta: 1.05,
    eps: 5.06,
    earningsDate: '2024-01-30',
    isFavorite: false,
    isWatching: true,
    tags: ['FAANG', 'AI', 'Mega Cap', 'Growth'],
    holdings: {
      quantity: 30,
      avgCost: 125.67,
      totalCost: 3770.10,
      currentValue: 4153.50,
      pnl: 383.40,
      pnlPercent: 10.17
    }
  },
  {
    id: 'AMZN',
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    industry: 'Internet Retail',
    price: 155.20,
    change: {
      value: 2.34,
      percent: 1.53
    },
    marketCap: 1605000000000,
    volume: 34567800,
    avgVolume: 41234500,
    peRatio: 76.45,
    dividendYield: 0,
    yearHigh: 175.62,
    yearLow: 81.43,
    fiftyTwoWeekChange: 67.3,
    beta: 1.14,
    eps: 2.03,
    earningsDate: '2024-02-01',
    isFavorite: true,
    isWatching: false,
    tags: ['FAANG', 'E-commerce', 'Cloud Computing', 'Mega Cap']
  },
  {
    id: 'META',
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    exchange: 'NASDAQ',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    price: 353.67,
    change: {
      value: -3.21,
      percent: -0.90
    },
    marketCap: 905600000000,
    volume: 18765400,
    avgVolume: 22345600,
    peRatio: 32.56,
    dividendYield: 0,
    yearHigh: 382.18,
    yearLow: 88.09,
    fiftyTwoWeekChange: 178.4,
    beta: 1.21,
    eps: 10.86,
    earningsDate: '2024-01-31',
    isFavorite: false,
    isWatching: true,
    tags: ['FAANG', 'Social Media', 'Metaverse', 'Growth']
  },
  {
    id: 'TSLA',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    industry: 'Auto Manufacturers',
    price: 238.45,
    change: {
      value: -5.67,
      percent: -2.32
    },
    marketCap: 756800000000,
    volume: 123456700,
    avgVolume: 145678900,
    peRatio: 78.92,
    dividendYield: 0,
    yearHigh: 299.29,
    yearLow: 101.81,
    fiftyTwoWeekChange: 112.7,
    beta: 2.01,
    eps: 3.02,
    earningsDate: '2024-01-24',
    isFavorite: true,
    isWatching: true,
    tags: ['EV', 'Clean Energy', 'Mega Cap', 'Volatile'],
    holdings: {
      quantity: 10,
      avgCost: 210.25,
      totalCost: 2102.50,
      currentValue: 2384.50,
      pnl: 282.00,
      pnlPercent: 13.41
    }
  },
  {
    id: 'NVDA',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Semiconductors',
    price: 488.90,
    change: {
      value: 12.34,
      percent: 2.59
    },
    marketCap: 1208000000000,
    volume: 45678900,
    avgVolume: 52345600,
    peRatio: 62.78,
    dividendYield: 0.04,
    yearHigh: 505.48,
    yearLow: 138.84,
    fiftyTwoWeekChange: 215.6,
    beta: 1.72,
    eps: 7.79,
    earningsDate: '2024-02-21',
    isFavorite: true,
    isWatching: true,
    tags: ['AI', 'Semiconductors', 'Gaming', 'Mega Cap'],
    holdings: {
      quantity: 8,
      avgCost: 320.45,
      totalCost: 2563.60,
      currentValue: 3911.20,
      pnl: 1347.60,
      pnlPercent: 52.55
    }
  },
  {
    id: 'JPM',
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    exchange: 'NYSE',
    sector: 'Financial Services',
    industry: 'Banks—Diversified',
    price: 170.28,
    change: {
      value: 1.23,
      percent: 0.73
    },
    marketCap: 499800000000,
    volume: 8765400,
    avgVolume: 9876500,
    peRatio: 10.45,
    dividendYield: 2.35,
    yearHigh: 172.96,
    yearLow: 120.78,
    fiftyTwoWeekChange: 18.7,
    beta: 1.12,
    eps: 16.30,
    earningsDate: '2024-01-12',
    isFavorite: false,
    isWatching: false,
    tags: ['Banking', 'Dividend', 'Blue Chip', 'Financials'],
    holdings: {
      quantity: 20,
      avgCost: 155.67,
      totalCost: 3113.40,
      currentValue: 3405.60,
      pnl: 292.20,
      pnlPercent: 9.39
    }
  },
  {
    id: 'V',
    symbol: 'V',
    name: 'Visa Inc.',
    exchange: 'NYSE',
    sector: 'Financial Services',
    industry: 'Credit Services',
    price: 259.34,
    change: {
      value: -1.23,
      percent: -0.47
    },
    marketCap: 500200000000,
    volume: 5432100,
    avgVolume: 6543200,
    peRatio: 31.56,
    dividendYield: 0.77,
    yearHigh: 290.96,
    yearLow: 206.12,
    fiftyTwoWeekChange: 12.3,
    beta: 0.98,
    eps: 8.22,
    earningsDate: '2024-01-25',
    isFavorite: true,
    isWatching: true,
    tags: ['Payments', 'Dividend', 'Blue Chip', 'Financials']
  },
  {
    id: 'WMT',
    symbol: 'WMT',
    name: 'Walmart Inc.',
    exchange: 'NYSE',
    sector: 'Consumer Defensive',
    industry: 'Discount Stores',
    price: 156.78,
    change: {
      value: 0.45,
      percent: 0.29
    },
    marketCap: 422800000000,
    volume: 1876500,
    avgVolume: 1987600,
    peRatio: 28.76,
    dividendYield: 1.40,
    yearHigh: 169.94,
    yearLow: 136.09,
    fiftyTwoWeekChange: 8.9,
    beta: 0.49,
    eps: 5.45,
    earningsDate: '2024-02-20',
    isFavorite: false,
    isWatching: false,
    tags: ['Retail', 'Dividend', 'Blue Chip', 'Defensive']
  },
  {
    id: 'JNJ',
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    exchange: 'NYSE',
    sector: 'Healthcare',
    industry: 'Drug Manufacturers—General',
    price: 152.34,
    change: {
      value: -0.67,
      percent: -0.44
    },
    marketCap: 393500000000,
    volume: 8765400,
    avgVolume: 9876500,
    peRatio: 31.45,
    dividendYield: 3.12,
    yearHigh: 175.98,
    yearLow: 144.95,
    fiftyTwoWeekChange: -5.6,
    beta: 0.54,
    eps: 4.84,
    earningsDate: '2024-01-23',
    isFavorite: true,
    isWatching: false,
    tags: ['Healthcare', 'Dividend', 'Blue Chip', 'Defensive'],
    holdings: {
      quantity: 15,
      avgCost: 160.23,
      totalCost: 2403.45,
      currentValue: 2285.10,
      pnl: -118.35,
      pnlPercent: -4.92
    }
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
  if (num >= 1000000000000) {
    return `$${(num / 1000000000000).toFixed(2)}T`;
  }
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(2)}B`;
  }
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`;
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

const formatNumber = (num: number, decimals: number = 2) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num);
};

export default function StocksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedExchanges, setSelectedExchanges] = useState<string[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'symbol', 
    direction: 'asc' 
  });

  const sectors = [...new Set(mockStocks.map(stock => stock.sector))];
  const exchanges = [...new Set(mockStocks.map(stock => stock.exchange))];
  const hasHoldings = mockStocks.some(stock => stock.holdings);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStocks(filteredStocks.map(stock => stock.id));
    } else {
      setSelectedStocks([]);
    }
  };

  const toggleSelectStock = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedStocks([...selectedStocks, id]);
    } else {
      setSelectedStocks(selectedStocks.filter(stockId => stockId !== id));
    }
  };

  const toggleExchange = (exchange: string) => {
    if (selectedExchanges.includes(exchange)) {
      setSelectedExchanges(selectedExchanges.filter(e => e !== exchange));
    } else {
      setSelectedExchanges([...selectedExchanges, exchange]);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredStocks = mockStocks
    .filter(stock => {
      const matchesSearch = 
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSector = 
        selectedSector === 'all' || 
        stock.sector === selectedSector;
      
      const matchesExchange = 
        selectedExchanges.length === 0 || 
        selectedExchanges.includes(stock.exchange);
      
      const matchesTab = 
        activeTab === 'all' ||
        (activeTab === 'favorites' && stock.isFavorite) ||
        (activeTab === 'watchlist' && stock.isWatching) ||
        (activeTab === 'holdings' && stock.holdings) ||
        (activeTab === 'dividends' && stock.dividendYield > 0);
      
      return matchesSearch && matchesSector && matchesExchange && matchesTab;
    })
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.key) {
        case 'symbol':
          aValue = a.symbol;
          bValue = b.symbol;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'change':
          aValue = a.change.percent;
          bValue = b.change.percent;
          break;
        case 'marketCap':
          aValue = a.marketCap;
          bValue = b.marketCap;
          break;
        case 'volume':
          aValue = a.volume;
          bValue = b.volume;
          break;
        case 'peRatio':
          aValue = a.peRatio;
          bValue = b.peRatio;
          break;
        case 'dividendYield':
          aValue = a.dividendYield;
          bValue = b.dividendYield;
          break;
        case 'sector':
          aValue = a.sector;
          bValue = b.sector;
          break;
        case 'exchange':
          aValue = a.exchange;
          bValue = b.exchange;
          break;
        case 'pnl':
          aValue = a.holdings?.pnlPercent || 0;
          bValue = b.holdings?.pnlPercent || 0;
          break;
        default:
          aValue = a.symbol;
          bValue = b.symbol;
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

  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-foreground';
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="h-4 w-4 mr-0.5" />;
    if (value < 0) return <ArrowDownRight className="h-4 w-4 mr-0.5" />;
    return <Minus className="h-4 w-4 mr-0.5" />;
  };

  const totalPortfolioValue = mockStocks
    .filter(stock => stock.holdings)
    .reduce((sum, stock) => sum + (stock.holdings?.currentValue || 0), 0);

  const totalCostBasis = mockStocks
    .filter(stock => stock.holdings)
    .reduce((sum, stock) => sum + (stock.holdings?.totalCost || 0), 0);

  const totalPnl = totalPortfolioValue - totalCostBasis;
  const totalPnlPercent = totalCostBasis > 0 ? (totalPnl / totalCostBasis) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Stocks</h1>
          <p className="text-muted-foreground">Track and manage your stock investments</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {hasHoldings && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</p>
              <p className="text-sm text-muted-foreground">
                {filteredStocks.filter(s => s.holdings).length} holdings
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${getChangeColor(totalPnl)}`}>
                {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl)}
              </p>
              <p className={`text-sm ${getChangeColor(totalPnl)}`}>
                {totalPnl >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}% all time
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today's Change</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">+$342.18</p>
              <p className="text-sm text-green-600">+1.24%</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Dividend Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$128.45</p>
              <p className="text-sm text-muted-foreground">Next: $45.67 in 12 days</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <TabsList>
              <TabsTrigger value="all">All Stocks</TabsTrigger>
              <TabsTrigger value="holdings">My Holdings</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
              <TabsTrigger value="dividends">Dividends</TabsTrigger>
            </TabsList>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={viewMode === 'table' ? 'bg-muted' : ''}
              onClick={() => setViewMode('table')}
              title="Table view"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={viewMode === 'grid' ? 'bg-muted' : ''}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Sector</h4>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                  >
                    <option value="all">All Sectors</option>
                    {sectors.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Exchange</h4>
                  <div className="space-y-2">
                    {exchanges.map(exchange => (
                      <div key={exchange} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`exchange-${exchange}`}
                          checked={selectedExchanges.includes(exchange)}
                          onCheckedChange={() => toggleExchange(exchange)}
                        />
                        <label 
                          htmlFor={`exchange-${exchange}`} 
                          className="text-sm"
                        >
                          {exchange}
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
                      setSelectedSector('all');
                      setSelectedExchanges([]);
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
          {selectedStocks.length > 0 && (
            <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedStocks.length === filteredStocks.length && filteredStocks.length > 0}
                  onCheckedChange={(checked) => toggleSelectAll(checked as boolean)}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  {selectedStocks.length} {selectedStocks.length === 1 ? 'stock' : 'stocks'} selected
                </label>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => console.log('Compare selected stocks')}
                >
                  <BarChart2 className="h-4 w-4 mr-1" /> Compare
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => console.log('Add to watchlist')}
                >
                  <Eye className="h-4 w-4 mr-1" /> Watchlist
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => console.log('Remove selected stocks')}
                >
                  <XCircle className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>
            </div>
          )}
          
          {viewMode === 'table' ? (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        id="select-all-header"
                        checked={selectedStocks.length === filteredStocks.length && filteredStocks.length > 0}
                        onCheckedChange={(checked) => toggleSelectAll(checked as boolean)}
                        disabled={filteredStocks.length === 0}
                      />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('symbol')}
                    >
                      <div className="flex items-center">
                        Symbol {getSortIndicator('symbol')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Name {getSortIndicator('name')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer hover:text-primary"
                      onClick={() => handleSort('price')}
                    >
                      <div className="flex justify-end items-center">
                        Price {getSortIndicator('price')}
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
                    {hasHoldings && (
                      <TableHead 
                        className="text-right cursor-pointer hover:text-primary"
                        onClick={() => handleSort('pnl')}
                      >
                        <div className="flex justify-end items-center">
                          P/L {getSortIndicator('pnl')}
                        </div>
                      </TableHead>
                    )}
                    <TableHead 
                      className="text-right cursor-pointer hover:text-primary"
                      onClick={() => handleSort('marketCap')}
                    >
                      <div className="flex justify-end items-center">
                        Market Cap {getSortIndicator('marketCap')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer hover:text-primary"
                      onClick={() => handleSort('volume')}
                    >
                      <div className="flex justify-end items-center">
                        Volume {getSortIndicator('volume')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer hover:text-primary"
                      onClick={() => handleSort('peRatio')}
                    >
                      <div className="flex justify-end items-center">
                        P/E {getSortIndicator('peRatio')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer hover:text-primary"
                      onClick={() => handleSort('dividendYield')}
                    >
                      <div className="flex justify-end items-center">
                        Dividend {getSortIndicator('dividendYield')}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStocks.length > 0 ? (
                    filteredStocks.map((stock) => (
                      <TableRow key={stock.id} className="group">
                        <TableCell>
                          <Checkbox
                            checked={selectedStocks.includes(stock.id)}
                            onCheckedChange={(checked) => 
                              toggleSelectStock(stock.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium font-mono">{stock.symbol}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{stock.name}</div>
                          <div className="text-xs text-muted-foreground">{stock.exchange}</div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(stock.price)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className={`flex items-center justify-end ${getChangeColor(stock.change.percent)}`}>
                            {getChangeIcon(stock.change.percent)}
                            {Math.abs(stock.change.percent).toFixed(2)}%
                            <span className="ml-1 text-xs opacity-70">
                              ({stock.change.value >= 0 ? '+' : ''}{stock.change.value.toFixed(2)})
                            </span>
                          </div>
                        </TableCell>
                        {hasHoldings && (
                          <TableCell className="text-right">
                            {stock.holdings ? (
                              <div className="flex flex-col items-end">
                                <span className={getChangeColor(stock.holdings.pnl)}>
                                  {stock.holdings.pnl >= 0 ? '+' : ''}{formatCurrency(stock.holdings.pnl)}
                                </span>
                                <span className={`text-xs ${getChangeColor(stock.holdings.pnlPercent)}`}>
                                  {stock.holdings.pnlPercent >= 0 ? '+' : ''}{stock.holdings.pnlPercent.toFixed(2)}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                        )}
                        <TableCell className="text-right">
                          {formatLargeNumber(stock.marketCap)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(stock.volume / 1000000, 1)}M
                        </TableCell>
                        <TableCell className="text-right">
                          {stock.peRatio ? stock.peRatio.toFixed(2) : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {stock.dividendYield > 0 ? (
                            <span className="text-green-600">{stock.dividendYield}%</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end">
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
                                  <LineChartIcon className="h-4 w-4 mr-2" />
                                  Chart
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                                  Trade
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  Add to Portfolio
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  {stock.isWatching ? (
                                    <>
                                      <EyeOff className="h-4 w-4 mr-2" />
                                      Remove from Watchlist
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="h-4 w-4 mr-2" />
                                      Add to Watchlist
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  {stock.isFavorite ? (
                                    <>
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Remove from Favorites
                                    </>
                                  ) : (
                                    <>
                                      <Star className="h-4 w-4 mr-2" />
                                      Add to Favorites
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Bell className="h-4 w-4 mr-2" />
                                  Set Alert
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Share
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={hasHoldings ? 12 : 11} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center py-8">
                          <BarChart2 className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No stocks found</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Try adjusting your search or filter to find what you're looking for.
                          </p>
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedSector('all');
                              setSelectedExchanges([]);
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
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredStocks.map((stock) => (
                <Card key={stock.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                        <CardDescription className="truncate">{stock.name}</CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => console.log('Toggle favorite')}
                        >
                          <Star className={`h-4 w-4 ${stock.isFavorite ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => console.log('Toggle watchlist')}
                        >
                          <Eye className={`h-4 w-4 ${stock.isWatching ? 'text-blue-500' : 'text-muted-foreground'}`} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{formatCurrency(stock.price)}</span>
                        <span className={`flex items-center ${getChangeColor(stock.change.percent)}`}>
                          {getChangeIcon(stock.change.percent)}
                          {Math.abs(stock.change.percent).toFixed(2)}%
                        </span>
                      </div>
                      
                      {stock.holdings && (
                        <div className="space-y-2 pt-2 border-t">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shares</span>
                            <span>{stock.holdings.quantity}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Avg. Cost</span>
                            <span>{formatCurrency(stock.holdings.avgCost)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Market Value</span>
                            <span className="font-medium">{formatCurrency(stock.holdings.currentValue)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">P/L</span>
                            <span className={getChangeColor(stock.holdings.pnl)}>
                              {stock.holdings.pnl >= 0 ? '+' : ''}{formatCurrency(stock.holdings.pnl)} 
                              <span className="ml-1">
                                ({stock.holdings.pnlPercent >= 0 ? '+' : ''}{stock.holdings.pnlPercent.toFixed(2)}%)
                              </span>
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-2 flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <ArrowRightLeft className="h-4 w-4 mr-2" />
                          Trade
                        </Button>
                        <Button variant="outline" size="icon" className="w-10">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredStocks.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <BarChart2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No stocks found</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSector('all');
                      setSelectedExchanges([]);
                      setActiveTab('all');
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Showing <span className="font-medium">{filteredStocks.length}</span> of{' '}
              <span className="font-medium">{mockStocks.length}</span> stocks
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
      
      {/* Stock Detail View - Would be a modal or separate page in a real app */}
      {filteredStocks.length === 1 && searchQuery && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-2xl">
                    {filteredStocks[0].name} <span className="text-muted-foreground">({filteredStocks[0].symbol})</span>
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Star className={`h-4 w-4 ${filteredStocks[0].isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className={`h-4 w-4 ${filteredStocks[0].isWatching ? 'text-blue-500' : ''}`} />
                  </Button>
                </div>
                <CardDescription className="mt-1">
                  {filteredStocks[0].exchange} • {filteredStocks[0].sector} • {filteredStocks[0].industry}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Alert
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button size="sm">
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Trade
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-2xl font-semibold">{formatCurrency(filteredStocks[0].price)}</p>
                    <p className={`flex items-center ${getChangeColor(filteredStocks[0].change.percent)}`}>
                      {getChangeIcon(filteredStocks[0].change.percent)}
                      {Math.abs(filteredStocks[0].change.percent).toFixed(2)}% 
                      <span className="ml-1 text-sm">
                        ({filteredStocks[0].change.value >= 0 ? '+' : ''}{filteredStocks[0].change.value.toFixed(2)})
                      </span>
                    </p>
                  </div>
                  
                  <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Market Cap</p>
                    <p className="text-2xl font-semibold">{formatLargeNumber(filteredStocks[0].marketCap)}</p>
                    <p className="text-sm text-muted-foreground">
                      {filteredStocks[0].peRatio ? `P/E: ${filteredStocks[0].peRatio.toFixed(2)}` : 'P/E: -'}
                    </p>
                  </div>
                  
                  <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">52-Week Range</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(filteredStocks[0].yearLow)} - {formatCurrency(filteredStocks[0].yearHigh)}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ 
                          width: `${((filteredStocks[0].price - filteredStocks[0].yearLow) / (filteredStocks[0].yearHigh - filteredStocks[0].yearLow) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((filteredStocks[0].price - filteredStocks[0].yearLow) / (filteredStocks[0].yearHigh - filteredStocks[0].yearLow * 1) * 100).toFixed(1)}% to high
                    </p>
                  </div>
                  
                  <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Volume / Avg.</p>
                    <p className="text-lg font-semibold">
                      {formatNumber(filteredStocks[0].volume / 1000000, 1)}M / {formatNumber(filteredStocks[0].avgVolume / 1000000, 1)}M
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Beta: {filteredStocks[0].beta.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                {filteredStocks[0].holdings && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Your Holdings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">Shares</p>
                          <p className="text-xl font-semibold">{filteredStocks[0].holdings.quantity}</p>
                        </div>
                        <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">Avg. Cost</p>
                          <p className="text-xl font-semibold">{formatCurrency(filteredStocks[0].holdings.avgCost)}</p>
                        </div>
                        <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">Market Value</p>
                          <p className="text-xl font-semibold">{formatCurrency(filteredStocks[0].holdings.currentValue)}</p>
                        </div>
                        <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
                          <p className={`text-xl font-semibold ${getChangeColor(filteredStocks[0].holdings.pnl)}`}>
                            {filteredStocks[0].holdings.pnl >= 0 ? '+' : ''}{formatCurrency(filteredStocks[0].holdings.pnl)}
                            <span className="block text-sm">
                              ({filteredStocks[0].holdings.pnlPercent >= 0 ? '+' : ''}{filteredStocks[0].holdings.pnlPercent.toFixed(2)}%)
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Portfolio Allocation</span>
                          <span className="text-sm text-muted-foreground">
                            {((filteredStocks[0].holdings.currentValue / totalPortfolioValue) * 100).toFixed(1)}% of portfolio
                          </span>
                        </div>
                        <Progress 
                          value={(filteredStocks[0].holdings.currentValue / totalPortfolioValue) * 100} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div className="mt-6 flex space-x-2">
                        <Button variant="outline" className="flex-1">
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Buy
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Minus className="h-4 w-4 mr-2" />
                          Sell
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <Card>
                  <CardHeader>
                    <CardTitle>Key Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Previous Close</span>
                        <span className="font-medium">{formatCurrency(filteredStocks[0].price - filteredStocks[0].change.value)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Open</span>
                        <span className="font-medium">{formatCurrency(filteredStocks[0].price * 0.998)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Day's Range</span>
                        <span className="font-medium">
                          {formatCurrency(filteredStocks[0].price * 0.995)} - {formatCurrency(filteredStocks[0].price * 1.015)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">52-Week Range</span>
                        <span className="font-medium">
                          {formatCurrency(filteredStocks[0].yearLow)} - {formatCurrency(filteredStocks[0].yearHigh)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Volume</span>
                        <span className="font-medium">{formatNumber(filteredStocks[0].volume / 1000000, 1)}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg. Volume</span>
                        <span className="font-medium">{formatNumber(filteredStocks[0].avgVolume / 1000000, 1)}M</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Market Cap</span>
                        <span className="font-medium">{formatLargeNumber(filteredStocks[0].marketCap)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Beta (5Y Monthly)</span>
                        <span className="font-medium">{filteredStocks[0].beta.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">P/E Ratio (TTM)</span>
                        <span className="font-medium">{filteredStocks[0].peRatio ? filteredStocks[0].peRatio.toFixed(2) : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">EPS (TTM)</span>
                        <span className="font-medium">
                          {filteredStocks[0].eps ? formatCurrency(filteredStocks[0].eps) : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Earnings Date</span>
                        <span className="font-medium">
                          {new Date(filteredStocks[0].earningsDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Dividend & Yield</span>
                        <span className="font-medium">
                          {filteredStocks[0].dividendYield > 0 
                            ? `${formatCurrency(filteredStocks[0].price * (filteredStocks[0].dividendYield / 100))} (${filteredStocks[0].dividendYield}%)` 
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {filteredStocks[0].name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {filteredStocks[0].name} ({filteredStocks[0].symbol}) is a leading company in the {filteredStocks[0].industry} industry, 
                      operating in the {filteredStocks[0].sector} sector. The company is known for its innovative products and services 
                      that have revolutionized the way people interact with technology.
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Key Executives</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">CEO</span>
                          <span className="text-sm font-medium">John Doe</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">CFO</span>
                          <span className="text-sm font-medium">Jane Smith</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">COO</span>
                          <span className="text-sm font-medium">Robert Johnson</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Company Info</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Headquarters</span>
                          <span className="text-sm font-medium text-right">Cupertino, California, United States</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Founded</span>
                          <span className="text-sm font-medium">1976</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Employees</span>
                          <span className="text-sm font-medium">164,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Website</span>
                          <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
                            www.company.com
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Company Website
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Analyst Ratings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">15</div>
                        <div className="text-xs text-muted-foreground">Buy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">8</div>
                        <div className="text-xs text-muted-foreground">Overweight</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-xs text-muted-foreground">Hold</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">2</div>
                        <div className="text-xs text-muted-foreground">Underweight</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">1</div>
                        <div className="text-xs text-muted-foreground">Sell</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Average Target Price</span>
                        <span className="font-medium">{formatCurrency(filteredStocks[0].price * 1.12)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">High Estimate</span>
                        <span className="font-medium">{formatCurrency(filteredStocks[0].price * 1.25)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Low Estimate</span>
                        <span className="font-medium">{formatCurrency(filteredStocks[0].price * 0.85)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Upside Potential</span>
                        <span className="font-medium text-green-600">+12.5%</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Earnings History</h4>
                      <div className="space-y-2">
                        {[
                          { date: '2023-10-25', estimate: 1.45, actual: 1.52, surprise: 4.83 },
                          { date: '2023-07-25', estimate: 1.32, actual: 1.38, surprise: 4.55 },
                          { date: '2023-04-25', estimate: 1.28, actual: 1.30, surprise: 1.56 },
                          { date: '2023-01-25', estimate: 1.18, actual: 1.22, surprise: 3.39 },
                        ].map((earnings, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {new Date(earnings.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            <div className="flex items-center">
                              <span className="font-medium w-16 text-right">${earnings.actual.toFixed(2)}</span>
                              <span className={`text-xs ml-2 ${earnings.surprise >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {earnings.surprise >= 0 ? '↑' : '↓'} {Math.abs(earnings.surprise)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>News & Updates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        title: `${filteredStocks[0].name} Reports Record Quarterly Earnings`, 
                        source: 'Bloomberg', 
                        time: '2h ago',
                        isPositive: true
                      },
                      {
                        title: `Analysts Raise Price Target for ${filteredStocks[0].symbol} After Strong Product Launch`, 
                        source: 'CNBC', 
                        time: '5h ago',
                        isPositive: true
                      },
                      {
                        title: `${filteredStocks[0].name} Expands Into New Markets with Strategic Acquisition`, 
                        source: 'Wall Street Journal', 
                        time: '1d ago',
                        isPositive: true
                      },
                      {
                        title: `Regulatory Concerns Weigh on ${filteredStocks[0].sector} Sector`, 
                        source: 'Financial Times', 
                        time: '2d ago',
                        isPositive: false
                      },
                    ].map((news, i) => (
                      <div key={i} className="pb-3 border-b last:border-b-0 last:pb-0 last:mb-0">
                        <div className="flex items-start">
                          <div className={`h-2 w-2 rounded-full mt-1.5 mr-2 flex-shrink-0 ${news.isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <div>
                            <h4 className="text-sm font-medium leading-tight">{news.title}</h4>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <span>{news.source}</span>
                              <span className="mx-1">•</span>
                              <span>{news.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full mt-2">
                      View All News
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
