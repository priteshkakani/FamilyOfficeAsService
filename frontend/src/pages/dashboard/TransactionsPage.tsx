import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, FileText, PieChart, BarChart, Download, Search } from 'lucide-react';
import { Input } from '../../components/ui/input';

type Transaction = {
  id: string;
  date: Date;
  description: string;
  category: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date('2023-11-10'),
    description: 'Stock Purchase - AAPL',
    category: 'Stocks',
    amount: 2500,
    type: 'debit',
    status: 'completed',
  },
  {
    id: '2',
    date: new Date('2023-11-09'),
    description: 'Mutual Fund Investment',
    category: 'Mutual Funds',
    amount: 5000,
    type: 'debit',
    status: 'completed',
  },
  {
    id: '3',
    date: new Date('2023-11-08'),
    description: 'Dividend Received',
    category: 'Dividend',
    amount: 150,
    type: 'credit',
    status: 'completed',
  },
  {
    id: '4',
    date: new Date('2023-11-07'),
    description: 'Stock Sale - GOOGL',
    category: 'Stocks',
    amount: 3200,
    type: 'credit',
    status: 'pending',
  },
];

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  // Remove unused setTransactions since we're using mock data
  const [transactions] = useState<Transaction[]>(mockTransactions);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleExport = () => {
    // In a real app, this would generate and download a CSV
    console.log('Exporting transactions:', filteredTransactions);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="w-full pl-8 md:w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Stocks">Stocks</option>
              <option value="Mutual Funds">Mutual Funds</option>
              <option value="Dividend">Dividend</option>
            </select>
            <Button 
              className="gap-1 bg-transparent border border-input hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-md text-sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add Transaction</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            <FileText className="mr-2 h-4 w-4" />
            All Transactions
          </TabsTrigger>
          <TabsTrigger value="mandates">
            <FileText className="mr-2 h-4 w-4" />
            Mandates
          </TabsTrigger>
          <TabsTrigger value="mutual-funds">
            <PieChart className="mr-2 h-4 w-4" />
            Mutual Funds
          </TabsTrigger>
          <TabsTrigger value="stocks">
            <BarChart className="mr-2 h-4 w-4" />
            Stocks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Transactions</CardTitle>
                <div className="flex space-x-2">
                  <Button className="bg-transparent border border-input hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-md text-sm">
                    Export
                  </Button>
                  <Button className="bg-transparent border border-input hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-md text-sm">
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Amount</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">{formatDate(transaction.date)}</td>
                            <td className="p-4 align-middle font-medium">{transaction.description}</td>
                            <td className="p-4 align-middle">
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                {transaction.category}
                              </span>
                            </td>
                            <td className={`p-4 text-right align-middle font-medium ${
                              transaction.type === 'credit' ? 'text-green-600' : 'text-foreground'
                            }`}>
                              {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </td>
                            <td className="p-4 text-right align-middle">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                transaction.status === 'completed' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                                  : transaction.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                              }`}>
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground">
                            No transactions found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mandates">
          <Card>
            <CardHeader>
              <CardTitle>Mandates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">Mandates will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mutual-funds">
          <Card>
            <CardHeader>
              <CardTitle>Mutual Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">Mutual fund transactions will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stocks">
          <Card>
            <CardHeader>
              <CardTitle>Stock Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">Stock transactions will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
