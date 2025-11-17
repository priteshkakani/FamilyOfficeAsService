import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

type InsurancePolicy = {
  id: string;
  type: string;
  provider: string;
  policyNumber: string;
  coverageAmount: number;
  premium: number;
  status: 'active' | 'expired' | 'pending';
  renewalDate: string;
  beneficiaries: string[];
};

const mockPolicies: InsurancePolicy[] = [
  {
    id: 'POL-001',
    type: 'Term Life Insurance',
    provider: 'Northwestern Mutual',
    policyNumber: 'TL-2023-001',
    coverageAmount: 1000000,
    premium: 1200,
    status: 'active',
    renewalDate: '2024-05-15',
    beneficiaries: ['Sarah Johnson (Spouse)', 'Michael Johnson (Child)']
  },
  {
    id: 'POL-002',
    type: 'Homeowners Insurance',
    provider: 'State Farm',
    policyNumber: 'HO-2023-045',
    coverageAmount: 500000,
    premium: 1800,
    status: 'active',
    renewalDate: '2024-07-22',
    beneficiaries: ['John Johnson', 'Sarah Johnson']
  },
  {
    id: 'POL-003',
    type: 'Auto Insurance',
    provider: 'Geico',
    policyNumber: 'AUTO-2023-089',
    coverageAmount: 100000,
    premium: 850,
    status: 'active',
    renewalDate: '2023-12-10',
    beneficiaries: ['John Johnson', 'Sarah Johnson']
  },
  {
    id: 'POL-004',
    type: 'Disability Insurance',
    provider: 'Guardian',
    policyNumber: 'DI-2022-112',
    coverageAmount: 5000,
    premium: 650,
    status: 'active',
    renewalDate: '2024-03-05',
    beneficiaries: ['John Johnson']
  },
  {
    id: 'POL-005',
    type: 'Umbrella Policy',
    provider: 'Liberty Mutual',
    policyNumber: 'UMB-2023-023',
    coverageAmount: 1000000,
    premium: 350,
    status: 'active',
    renewalDate: '2024-06-18',
    beneficiaries: ['John Johnson', 'Sarah Johnson']
  }
];

export default function InsurancePage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Insurance Planning</h1>
          <p className="text-muted-foreground">Manage and review your insurance coverage</p>
        </div>
        <Button>Add Policy</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$2,700,000</p>
            <p className="text-sm text-muted-foreground">Across 5 policies</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Annual Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$4,850</p>
            <p className="text-sm text-muted-foreground">$404/month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Next Renewal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Dec 10, 2023</p>
            <p className="text-sm text-muted-foreground">Auto Insurance</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Coverage Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1</p>
            <p className="text-sm text-muted-foreground">Critical illness not covered</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Policies</TabsTrigger>
          <TabsTrigger value="life">Life</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="property">Property</TabsTrigger>
          <TabsTrigger value="auto">Auto</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Insurance Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPolicies.map((policy) => (
                  <div key={policy.id} className="p-4 border rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{policy.type}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(policy.status)}`}>
                            {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{policy.provider} • {policy.policyNumber}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Coverage</p>
                          <p className="font-medium">{formatCurrency(policy.coverageAmount)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Premium</p>
                          <p className="font-medium">{formatCurrency(policy.premium)}/year</p>
                        </div>
                        <div className="hidden md:block">
                          <p className="text-muted-foreground">Renews</p>
                          <p className="font-medium">
                            {new Date(policy.renewalDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    
                    {policy.beneficiaries.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-muted-foreground mb-1">Beneficiaries:</p>
                        <div className="flex flex-wrap gap-2">
                          {policy.beneficiaries.map((beneficiary, i) => (
                            <span key={i} className="text-xs bg-gray-100 rounded-full px-2 py-1">
                              {beneficiary}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="life">
          <Card>
            <CardHeader>
              <CardTitle>Life Insurance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Life insurance details will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Health Insurance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Health insurance details will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="property">
          <Card>
            <CardHeader>
              <CardTitle>Property Insurance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Property insurance details will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="auto">
          <Card>
            <CardHeader>
              <CardTitle>Auto Insurance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Auto insurance details will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Coverage Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Coverage analysis chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Policy Renewal Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Policy renewal calendar will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
