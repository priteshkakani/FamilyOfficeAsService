import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function LiabilitiesPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Liabilities</h1>
        <Button onClick={() => navigate('/dashboard/portfolio/liabilities/new')}>Add Liability</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Liabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 p-4 border rounded-lg items-center">
              <div>
                <p className="font-medium">Primary Mortgage</p>
                <p className="text-sm text-muted-foreground">Real Estate Loan</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$320,000.00</p>
                <p className="text-sm text-muted-foreground">30-year fixed @ 3.5%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Monthly Payment</p>
                <p className="font-medium">$1,437.00</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Term Remaining</p>
                <p className="text-sm">27 years, 6 months</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>

            <div className="grid grid-cols-5 p-4 border rounded-lg items-center">
              <div>
                <p className="font-medium">Auto Loan</p>
                <p className="text-sm text-muted-foreground">Vehicle Loan</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$18,500.00</p>
                <p className="text-sm text-muted-foreground">5-year term @ 2.9%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Monthly Payment</p>
                <p className="font-medium">$332.00</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Term Remaining</p>
                <p className="text-sm">3 years, 2 months</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
