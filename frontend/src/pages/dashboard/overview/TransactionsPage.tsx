import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TransactionsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Recent Transactions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Salary Deposit</p>
                <p className="text-sm text-muted-foreground">May 15, 2023</p>
              </div>
              <p className="font-medium text-green-600">+$5,000.00</p>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Grocery Store</p>
                <p className="text-sm text-muted-foreground">May 14, 2023</p>
              </div>
              <p className="font-medium text-red-600">-$125.30</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
