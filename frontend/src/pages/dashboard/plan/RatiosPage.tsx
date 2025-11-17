import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type RatioCardProps = {
  title: string;
  value: string;
  description: string;
  status: 'good' | 'warning' | 'danger';
  recommendation?: string;
};

const RatioCard = ({ title, value, description, status, recommendation }: RatioCardProps) => {
  const statusColors = {
    good: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
            {status === 'good' ? 'Good' : status === 'warning' ? 'Needs Attention' : 'Action Needed'}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-2">{value}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        {recommendation && (
          <div className="mt-3 p-3 bg-muted/50 rounded-md">
            <p className="text-xs font-medium">Recommendation:</p>
            <p className="text-xs">{recommendation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function RatiosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Financial Ratios</h1>
        <p className="text-muted-foreground">Key metrics to assess your financial health</p>
      </div>
      
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal Finance</TabsTrigger>
          <TabsTrigger value="investment">Investment</TabsTrigger>
          <TabsTrigger value="retirement">Retirement</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <RatioCard
              title="Debt-to-Income Ratio"
              value="28%"
              description="Monthly debt payments ÷ Monthly gross income"
              status="good"
              recommendation="Keep below 36% for healthy finances"
            />
            
            <RatioCard
              title="Savings Ratio"
              value="18%"
              description="Monthly savings ÷ Monthly gross income"
              status="warning"
              recommendation="Aim for 20% or more for optimal financial health"
            />
            
            <RatioCard
              title="Liquidity Ratio"
              value="8 months"
              description="Liquid assets ÷ Monthly expenses"
              status="good"
              recommendation="3-6 months is recommended"
            />
            
            <RatioCard
              title="Housing Expense Ratio"
              value="26%"
              description="Monthly housing costs ÷ Monthly gross income"
              status="good"
              recommendation="Keep below 28% of gross income"
            />
            
            <RatioCard
              title="Debt Service Ratio"
              value="34%"
              description="Total monthly debt payments ÷ Monthly gross income"
              status="warning"
              recommendation="Consider paying down high-interest debt"
            />
            
            <RatioCard
              title="Net Worth to Income"
              value="3.5x"
              description="Net worth ÷ Annual income"
              status="good"
              recommendation="Aim for 1x by age 30, 2x by 40, 4x by 50"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="investment" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <RatioCard
              title="Investment to Assets"
              value="65%"
              description="Invested assets ÷ Total assets"
              status="good"
              recommendation="Aim for 50% or more in growth assets"
            />
            
            <RatioCard
              title="Expense Ratio"
              value="0.45%"
              description="Annual fund expenses ÷ Average fund assets"
              status="warning"
              recommendation="Consider lower-cost index funds (under 0.20%)"
            />
            
            <RatioCard
              title="Dividend Yield"
              value="2.1%"
              description="Annual dividends per share ÷ Price per share"
              status="good"
              recommendation="Balanced with growth is ideal"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="retirement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <RatioCard
              title="Retirement Ratio"
              value="42%"
              description="Current retirement savings ÷ Retirement goal"
              status="warning"
              recommendation="Aim to save 15-20% of income for retirement"
            />
            
            <RatioCard
              title="Withdrawal Rate"
              value="3.8%"
              description="Annual retirement spending ÷ Total retirement savings"
              status="good"
              recommendation="4% or less is considered safe"
            />
            
            <RatioCard
              title="Replacement Ratio"
              value="72%"
              description="Retirement income ÷ Pre-retirement income"
              status="good"
              recommendation="70-80% is typically recommended"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Ratio Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Ratio trend analysis and recommendations will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
