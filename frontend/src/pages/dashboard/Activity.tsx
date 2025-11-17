import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { FileText, Calculator } from 'lucide-react';

const Activity = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Activity</h2>
      </div>

      <Tabs defaultValue="notes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Notes</span>
          </TabsTrigger>
          <TabsTrigger value="calculators" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span>Calculators</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your notes will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Calculators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <h3 className="font-medium">Compound Interest</h3>
                    <p className="text-sm text-muted-foreground">Calculate investment growth over time</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <h3 className="font-medium">Loan Payment</h3>
                    <p className="text-sm text-muted-foreground">Estimate monthly payments</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <h3 className="font-medium">Retirement</h3>
                    <p className="text-sm text-muted-foreground">Plan your retirement savings</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Activity;
