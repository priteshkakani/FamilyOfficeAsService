import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  status: 'on_track' | 'needs_attention' | 'at_risk';
  monthlyContribution: number;
  notes?: string;
};

const mockGoals: Goal[] = [
  {
    id: 'G-001',
    name: 'Emergency Fund',
    targetAmount: 30000,
    currentAmount: 18000,
    targetDate: '2024-12-31',
    priority: 'high',
    category: 'Emergency',
    status: 'on_track',
    monthlyContribution: 1000,
    notes: '6 months of living expenses',
  },
  {
    id: 'G-002',
    name: 'European Vacation',
    targetAmount: 10000,
    currentAmount: 3500,
    targetDate: '2024-06-15',
    priority: 'medium',
    category: 'Travel',
    status: 'needs_attention',
    monthlyContribution: 500,
  },
  {
    id: 'G-003',
    name: 'New Car Fund',
    targetAmount: 40000,
    currentAmount: 12000,
    targetDate: '2025-12-31',
    priority: 'medium',
    category: 'Vehicle',
    status: 'on_track',
    monthlyContribution: 1200,
  },
  {
    id: 'G-004',
    name: 'Home Down Payment',
    targetAmount: 150000,
    currentAmount: 45000,
    targetDate: '2026-06-30',
    priority: 'high',
    category: 'Housing',
    status: 'at_risk',
    monthlyContribution: 2000,
  },
  {
    id: 'G-005',
    name: 'Retirement Catch-up',
    targetAmount: 500000,
    currentAmount: 150000,
    targetDate: '2035-01-01',
    priority: 'high',
    category: 'Retirement',
    status: 'on_track',
    monthlyContribution: 3000,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'on_track':
      return 'bg-green-100 text-green-800';
    case 'needs_attention':
      return 'bg-yellow-100 text-yellow-800';
    case 'at_risk':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const calculateProgress = (current: number, target: number) => {
  return Math.min(Math.round((current / target) * 100), 100);
};

const calculateMonthsRemaining = (targetDate: string) => {
  const target = new Date(targetDate);
  const now = new Date();
  const months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
  return Math.max(0, months);
};

export default function GoalsPage() {
  const categories = [...new Set(mockGoals.map((goal) => goal.category))];
  
  const getGoalsByStatus = (status: string) => {
    return mockGoals.filter((goal) => goal.status === status);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Financial Goals</h1>
          <p className="text-muted-foreground">Track and manage your financial objectives</p>
        </div>
        <Button>Create New Goal</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockGoals.length}</p>
            <p className="text-sm text-muted-foreground">across {categories.length} categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Target</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(mockGoals.reduce((sum, goal) => sum + goal.targetAmount, 0))}
            </p>
            <p className="text-sm text-muted-foreground">across all goals</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Contribution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(mockGoals.reduce((sum, goal) => sum + goal.monthlyContribution, 0))}
            </p>
            <p className="text-sm text-muted-foreground">total per month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Goals at Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {mockGoals.filter((goal) => goal.status === 'at_risk').length}
            </p>
            <p className="text-sm text-muted-foreground">needs attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="all">All Goals</TabsTrigger>
            <TabsTrigger value="on_track">On Track</TabsTrigger>
            <TabsTrigger value="needs_attention">Needs Attention</TabsTrigger>
            <TabsTrigger value="at_risk">At Risk</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="flex h-10 w-full sm:w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select className="flex h-10 w-full sm:w-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockGoals.map((goal) => {
              const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
              const monthsRemaining = calculateMonthsRemaining(goal.targetDate);
              const monthlyRequired = Math.ceil(
                (goal.targetAmount - goal.currentAmount) / Math.max(1, monthsRemaining)
              );
              
              return (
                <Card key={goal.id} className="flex flex-col h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(goal.priority)}`}>
                        {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(goal.status)}`}>
                        {goal.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                      <span className="text-xs text-muted-foreground">• {goal.category}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Current</p>
                          <p className="font-medium">{formatCurrency(goal.currentAmount)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Target</p>
                          <p className="font-medium">{formatCurrency(goal.targetAmount)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Monthly</p>
                          <p className="font-medium">{formatCurrency(goal.monthlyContribution)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Due Date</p>
                          <p className="font-medium">{formatDate(goal.targetDate)}</p>
                        </div>
                      </div>
                      
                      {goal.notes && (
                        <div className="text-sm">
                          <p className="text-muted-foreground">Notes</p>
                          <p className="text-sm">{goal.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <div className="p-4 pt-0">
                    <div className="flex justify-between items-center border-t pt-3">
                      <div className="text-sm text-muted-foreground">
                        {monthsRemaining} months remaining
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">Update</Button>
                        <Button size="sm">Contribute</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="on_track">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getGoalsByStatus('on_track').map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <CardTitle>{goal.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Goal details for {goal.name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="needs_attention">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getGoalsByStatus('needs_attention').map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <CardTitle>{goal.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Goal details for {goal.name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="at_risk">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getGoalsByStatus('at_risk').map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <CardTitle>{goal.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Goal details for {goal.name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Goals Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Timeline visualization of goals will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
