import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function InsurancePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Insurance</h1>
        <Button>Add Policy</Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Life Insurance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Term Life Policy</p>
                  <p className="text-sm text-muted-foreground">20-year term</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Coverage Amount</p>
                  <p className="font-medium">$1,000,000</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Beneficiary</p>
                  <p className="font-medium">Spouse</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" size="sm">View Details</Button>
                <Button variant="outline" size="sm">File Claim</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Property & Casualty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Homeowners Insurance</p>
                  <p className="text-sm text-muted-foreground">Primary Residence</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Coverage</p>
                  <p className="font-medium">$500,000</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Deductible</p>
                  <p className="font-medium">$2,500</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" size="sm">View Details</Button>
                <Button variant="outline" size="sm">File Claim</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Insurance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Insurance coverage visualization will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
