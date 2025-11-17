import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AssetsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Assets</h1>
        <Button>Add Asset</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 p-4 border rounded-lg items-center">
              <div>
                <p className="font-medium">Primary Home</p>
                <p className="text-sm text-muted-foreground">Real Estate</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$450,000.00</p>
                <p className="text-sm text-muted-foreground">45% of portfolio</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Appreciation</p>
                <p className="text-green-600">+5.2%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Last updated</p>
                <p className="text-sm">May 1, 2023</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-5 p-4 border rounded-lg items-center">
              <div>
                <p className="font-medium">Retirement Account</p>
                <p className="text-sm text-muted-foreground">401(k)</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$250,000.00</p>
                <p className="text-sm text-muted-foreground">25% of portfolio</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">YTD Return</p>
                <p className="text-green-600">+8.7%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Last updated</p>
                <p className="text-sm">May 10, 2023</p>
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
