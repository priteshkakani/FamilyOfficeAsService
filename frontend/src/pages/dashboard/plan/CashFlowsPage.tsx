import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CashFlowsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cash Flow Analysis</h1>
          <p className="text-muted-foreground">Track and analyze your income and expenses</p>
        </div>
        <Button>Add Transaction</Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$8,750.00</p>
            <p className="text-sm text-green-600">+$250 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$5,230.00</p>
            <p className="text-sm text-red-600">+$180 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$3,520.00</p>
            <p className="text-sm text-green-600">+$70 from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Cash flow trend chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 mt-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Income Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Income breakdown chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Expense breakdown chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Recent Transactions</CardTitle>
                <div className="flex gap-2">
                  <Input placeholder="Search transactions..." className="max-w-xs" />
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="housing">Housing</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="food">Food & Dining</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-blue-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Salary Deposit</p>
                        <p className="text-sm text-muted-foreground">May 15, 2023 • Income</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+$5,000.00</p>
                      <p className="text-sm text-muted-foreground">Employer Inc.</p>
                    </div>
                  </div>
                ))}
                <div className="flex justify-center mt-4">
                  <Button variant="outline">Load More</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Income Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Salary', amount: 4500, percentage: 85, color: 'bg-blue-500' },
                    { name: 'Investments', amount: 500, percentage: 10, color: 'bg-green-500' },
                    { name: 'Freelance', amount: 300, percentage: 5, color: 'bg-yellow-500' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>${item.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Housing', amount: 1800, percentage: 45, color: 'bg-red-500' },
                    { name: 'Food & Dining', amount: 800, percentage: 20, color: 'bg-orange-500' },
                    { name: 'Transportation', amount: 500, percentage: 12.5, color: 'bg-yellow-500' },
                    { name: 'Entertainment', amount: 300, percentage: 7.5, color: 'bg-green-500' },
                    { name: 'Utilities', amount: 200, percentage: 5, color: 'bg-blue-500' },
                    { name: 'Other', amount: 400, percentage: 10, color: 'bg-purple-500' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>${item.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Budget Planning</CardTitle>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Monthly Budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Create Budget</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { category: 'Housing', budget: 2000, spent: 1800, progress: 90 },
                  { category: 'Food & Dining', budget: 1000, spent: 800, progress: 80 },
                  { category: 'Transportation', budget: 600, spent: 500, progress: 83 },
                  { category: 'Entertainment', budget: 400, spent: 300, progress: 75 },
                  { category: 'Utilities', budget: 300, spent: 200, progress: 67 },
                  { category: 'Savings', budget: 1000, spent: 1200, progress: 120 },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.category}</span>
                      <span>${item.spent.toLocaleString()} of ${item.budget.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-full rounded-full ${
                          item.progress > 100 ? 'bg-red-500' : 
                          item.progress > 80 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(item.progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${item.budget - item.spent > 0 ? `${item.budget - item.spent} left` : `${Math.abs(item.budget - item.spent)} over`}</span>
                      <span>{item.progress}% of budget</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Projections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Cash flow projection chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Savings Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { goal: 'Emergency Fund', target: 30000, current: 25000, deadline: '2024-12-31' },
                { goal: 'Vacation Fund', target: 5000, current: 2000, deadline: '2023-09-30' },
                { goal: 'New Car', target: 40000, current: 15000, deadline: '2025-06-30' },
              ].map((item, i) => {
                const progress = Math.round((item.current / item.target) * 100);
                return (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.goal}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${item.current.toLocaleString()} of ${item.target.toLocaleString()}</span>
                      <span>Target: {new Date(item.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
              <Button variant="outline" className="w-full mt-4">Add New Goal</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
