import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SummaryPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Financial Plan Summary</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$785,430.00</p>
            <p className="text-sm text-muted-foreground">+12.5% from last year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Debt-to-Income Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">28%</p>
            <p className="text-sm text-muted-foreground">Healthy (recommended &lt; 36%)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Emergency Fund</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8 months</p>
            <p className="text-sm text-muted-foreground">of living expenses covered</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Retirement Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Retirement Goal Progress</span>
                  <span className="text-sm font-medium">42%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">$1.2M saved of $2.8M goal</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Current Age</p>
                  <p className="font-medium">38</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Retirement Age</p>
                  <p className="font-medium">65</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Debt Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Debt Payoff Progress</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">$185,000 remaining of $530,000</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Total Debt</p>
                  <p className="font-medium">$345,000</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Interest Rate (avg)</p>
                  <p className="font-medium">4.2%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Financial Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="3"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="3"
                  strokeDasharray="78, 100"
                />
                <text x="18" y="20.5" textAnchor="middle" className="text-2xl font-bold">78</text>
                <text x="18" y="25.5" textAnchor="middle" className="text-sm text-muted-foreground">Good</text>
              </svg>
            </div>
            <div className="ml-8 space-y-4">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <span>Retirement Planning</span>
                <span className="ml-auto font-medium">82/100</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <span>Debt Management</span>
                <span className="ml-auto font-medium">75/100</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                <span>Emergency Fund</span>
                <span className="ml-auto font-medium">65/100</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                <span>Insurance Coverage</span>
                <span className="ml-auto font-medium">90/100</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
