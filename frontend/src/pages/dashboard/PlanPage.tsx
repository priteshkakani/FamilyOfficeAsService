import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Target, Percent, Shield, Award, Plus } from 'lucide-react';

export default function PlanPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Financial Plan</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Plan
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">
            <Target className="mr-2 h-4 w-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="ratios">
            <Percent className="mr-2 h-4 w-4" />
            Ratios
          </TabsTrigger>
          <TabsTrigger value="insurance">
            <Shield className="mr-2 h-4 w-4" />
            Insurance
          </TabsTrigger>
          <TabsTrigger value="goals">
            <Award className="mr-2 h-4 w-4" />
            Goals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Retirement Readiness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">78%</div>
                <p className="text-sm text-muted-foreground">On track for retirement at 65</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Emergency Fund</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">6 mo</div>
                <p className="text-sm text-muted-foreground">Coverage of expenses</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Debt to Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">28%</div>
                <p className="text-sm text-muted-foreground">Healthy range: below 36%</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ratios">
          <Card>
            <CardHeader>
              <CardTitle>Financial Ratios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Financial ratios content will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Insurance coverage content will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Financial Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Financial goals content will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
