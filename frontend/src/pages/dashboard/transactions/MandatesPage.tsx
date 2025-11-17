import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Plus, Search, Filter, FileText, CreditCard, DollarSign, Calendar, Clock, AlertCircle, CheckCircle2, XCircle, Pause, Play, Trash2, Edit } from 'lucide-react';

type MandateStatus = 'active' | 'paused' | 'expired' | 'cancelled';
type MandateType = 'credit_card' | 'ach' | 'sepa' | 'direct_debit';
type PaymentFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';

interface Mandate {
  id: string;
  name: string;
  description: string;
  type: MandateType;
  status: MandateStatus;
  amount: number;
  currency: string;
  frequency: PaymentFrequency;
  nextPaymentDate: string;
  startDate: string;
  endDate: string | null;
  reference: string;
  beneficiary: {
    name: string;
    accountNumber: string;
    bankName?: string;
  };
  payer: {
    name: string;
    accountNumber: string;
    bankName?: string;
  };
  lastPayment?: {
    date: string;
    amount: number;
    status: 'success' | 'failed' | 'pending';
    reference: string;
  };
  maxAmount?: number;
  metadata?: Record<string, string>;
}

const mandateData: Mandate[] = [
  {
    id: 'MND-2023-001',
    name: 'Netflix Subscription',
    description: 'Monthly entertainment subscription',
    type: 'credit_card',
    status: 'active',
    amount: 15.99,
    currency: 'USD',
    frequency: 'monthly',
    nextPaymentDate: '2023-12-05',
    startDate: '2022-01-15',
    endDate: null,
    reference: 'NETFLX-001',
    beneficiary: {
      name: 'Netflix Inc.',
      accountNumber: '****-****-****-4242',
      bankName: 'Visa',
    },
    payer: {
      name: 'John Doe',
      accountNumber: '****-****-****-1234',
      bankName: 'Chase Bank',
    },
    lastPayment: {
      date: '2023-11-05',
      amount: 15.99,
      status: 'success',
      reference: 'PYM-001',
    },
  },
  {
    id: 'MND-2023-002',
    name: 'Gym Membership',
    description: 'Premium gym access',
    type: 'ach',
    status: 'active',
    amount: 45.00,
    currency: 'USD',
    frequency: 'monthly',
    nextPaymentDate: '2023-12-01',
    startDate: '2023-01-01',
    endDate: '2024-12-31',
    reference: 'GYM-001',
    beneficiary: {
      name: 'Fitness First',
      accountNumber: '*****7890',
      bankName: 'Bank of America',
    },
    payer: {
      name: 'John Doe',
      accountNumber: '*****4321',
      bankName: 'Chase Bank',
    },
    lastPayment: {
      date: '2023-11-01',
      amount: 45.00,
      status: 'success',
      reference: 'PYM-002',
    },
  },
  {
    id: 'MND-2023-003',
    name: 'Electric Bill',
    description: 'Monthly electricity bill payment',
    type: 'direct_debit',
    status: 'paused',
    amount: 85.50,
    currency: 'USD',
    frequency: 'monthly',
    nextPaymentDate: '2023-12-10',
    startDate: '2022-03-15',
    endDate: null,
    reference: 'ELEC-001',
    beneficiary: {
      name: 'City Power & Light',
      accountNumber: 'CPL-0012345',
    },
    payer: {
      name: 'John Doe',
      accountNumber: '*****4321',
      bankName: 'Chase Bank',
    },
    lastPayment: {
      date: '2023-10-10',
      amount: 82.75,
      status: 'success',
      reference: 'PYM-003',
    },
  },
  {
    id: 'MND-2023-004',
    name: 'Car Loan',
    description: 'Monthly car loan payment',
    type: 'ach',
    status: 'active',
    amount: 350.00,
    currency: 'USD',
    frequency: 'monthly',
    nextPaymentDate: '2023-12-15',
    startDate: '2021-06-15',
    endDate: '2026-06-15',
    reference: 'LOAN-001',
    beneficiary: {
      name: 'Auto Finance Co.',
      accountNumber: 'AFC-987654',
      bankName: 'Wells Fargo',
    },
    payer: {
      name: 'John Doe',
      accountNumber: '*****4321',
      bankName: 'Chase Bank',
    },
    lastPayment: {
      date: '2023-11-15',
      amount: 350.00,
      status: 'success',
      reference: 'PYM-004',
    },
  },
  {
    id: 'MND-2023-005',
    name: 'Charity Donation',
    description: 'Monthly donation to charity',
    type: 'credit_card',
    status: 'cancelled',
    amount: 25.00,
    currency: 'USD',
    frequency: 'monthly',
    nextPaymentDate: '2023-11-20',
    startDate: '2023-01-20',
    endDate: '2023-11-20',
    reference: 'CHAR-001',
    beneficiary: {
      name: 'Humanity First',
      accountNumber: '****-****-****-5678',
      bankName: 'Mastercard',
    },
    payer: {
      name: 'John Doe',
      accountNumber: '****-****-****-1234',
      bankName: 'Chase Bank',
    },
    lastPayment: {
      date: '2023-10-20',
      amount: 25.00,
      status: 'success',
      reference: 'PYM-005',
    },
  },
];

const getStatusBadge = (status: MandateStatus) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
    case 'paused':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Paused</Badge>;
    case 'expired':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Expired</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getTypeIcon = (type: MandateType) => {
  switch (type) {
    case 'credit_card':
      return <CreditCard className="h-4 w-4 mr-2" />;
    case 'ach':
      return <FileText className="h-4 w-4 mr-2" />;
    case 'sepa':
      return <FileText className="h-4 w-4 mr-2" />;
    case 'direct_debit':
      return <DollarSign className="h-4 w-4 mr-2" />;
    default:
      return <FileText className="h-4 w-4 mr-2" />;
  }
};

const getFrequencyLabel = (frequency: PaymentFrequency) => {
  switch (frequency) {
    case 'weekly':
      return 'Weekly';
    case 'biweekly':
      return 'Bi-weekly';
    case 'monthly':
      return 'Monthly';
    case 'quarterly':
      return 'Quarterly';
    case 'yearly':
      return 'Yearly';
    default:
      return frequency;
  }
};

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function MandatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedMandates, setSelectedMandates] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const filteredMandates = mandateData.filter((mandate) => {
    const matchesSearch = 
      mandate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mandate.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mandate.reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === 'all' || 
      (selectedStatus === 'active' && mandate.status === 'active') ||
      (selectedStatus === 'inactive' && mandate.status !== 'active');
    
    const matchesType = 
      selectedType === 'all' || 
      mandate.type === selectedType;
    
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'active' && mandate.status === 'active') ||
      (activeTab === 'paused' && mandate.status === 'paused') ||
      (activeTab === 'expired' && mandate.status === 'expired') ||
      (activeTab === 'cancelled' && mandate.status === 'cancelled');
    
    return matchesSearch && matchesStatus && matchesType && matchesTab;
  });

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMandates(filteredMandates.map(mandate => mandate.id));
    } else {
      setSelectedMandates([]);
    }
  };

  const toggleSelectMandate = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedMandates([...selectedMandates, id]);
    } else {
      setSelectedMandates(selectedMandates.filter(mandateId => mandateId !== id));
    }
  };

  const handleBulkAction = (action: 'pause' | 'resume' | 'cancel') => {
    // In a real app, this would make an API call to update the mandates
    console.log(`Bulk ${action} for mandates:`, selectedMandates);
    // Reset selection after action
    setSelectedMandates([]);
  };

  const getTotalAmount = () => {
    return filteredMandates.reduce((sum, mandate) => sum + mandate.amount, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Payment Mandates</h1>
          <p className="text-muted-foreground">Manage your recurring payments and subscriptions</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Mandate
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Mandates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mandateData.length}</p>
            <p className="text-sm text-muted-foreground">across all accounts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Mandates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mandateData.filter(m => m.status === 'active').length}</p>
            <p className="text-sm text-muted-foreground">currently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Outflow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(
                mandateData
                  .filter(m => m.status === 'active' && m.frequency === 'monthly')
                  .reduce((sum, m) => sum + m.amount, 0)
              )}
            </p>
            <p className="text-sm text-muted-foreground">per month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {mandateData.length > 0 
                ? formatDate(
                    mandateData
                      .filter(m => m.status === 'active')
                      .sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime())[0]?.nextPaymentDate || ''
                  )
                : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">upcoming payment</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mandates..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="status-all" 
                        checked={selectedStatus === 'all'}
                        onCheckedChange={() => setSelectedStatus('all')}
                      />
                      <label htmlFor="status-all" className="text-sm">All Statuses</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="status-active" 
                        checked={selectedStatus === 'active'}
                        onCheckedChange={() => setSelectedStatus('active')}
                      />
                      <label htmlFor="status-active" className="text-sm">Active Only</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="status-inactive" 
                        checked={selectedStatus === 'inactive'}
                        onCheckedChange={() => setSelectedStatus('inactive')}
                      />
                      <label htmlFor="status-inactive" className="text-sm">Inactive Only</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Payment Type</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="type-all" 
                        checked={selectedType === 'all'}
                        onCheckedChange={() => setSelectedType('all')}
                      />
                      <label htmlFor="type-all" className="text-sm">All Types</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="type-credit-card" 
                        checked={selectedType === 'credit_card'}
                        onCheckedChange={() => setSelectedType('credit_card')}
                      />
                      <label htmlFor="type-credit-card" className="text-sm">Credit Card</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="type-ach" 
                        checked={selectedType === 'ach'}
                        onCheckedChange={() => setSelectedType('ach')}
                      />
                      <label htmlFor="type-ach" className="text-sm">ACH Transfer</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="type-direct-debit" 
                        checked={selectedType === 'direct_debit'}
                        onCheckedChange={() => setSelectedType('direct_debit')}
                      />
                      <label htmlFor="type-direct-debit" className="text-sm">Direct Debit</label>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <TabsContent value={activeTab} className="space-y-4">
          {selectedMandates.length > 0 && (
            <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedMandates.length === filteredMandates.length}
                  onCheckedChange={(checked) => toggleSelectAll(checked as boolean)}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  {selectedMandates.length} {selectedMandates.length === 1 ? 'mandate' : 'mandates'} selected
                </label>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('pause')}
                  disabled={!selectedMandates.some(id => 
                    mandateData.find(m => m.id === id)?.status === 'active'
                  )}
                >
                  <Pause className="h-4 w-4 mr-1" /> Pause
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('resume')}
                  disabled={!selectedMandates.some(id => 
                    mandateData.find(m => m.id === id)?.status === 'paused'
                  )}
                >
                  <Play className="h-4 w-4 mr-1" /> Resume
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleBulkAction('cancel')}
                >
                  <XCircle className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </div>
            </div>
          )}
          
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      id="select-all-header"
                      checked={selectedMandates.length === filteredMandates.length && filteredMandates.length > 0}
                      onCheckedChange={(checked) => toggleSelectAll(checked as boolean)}
                      disabled={filteredMandates.length === 0}
                    />
                  </TableHead>
                  <TableHead>Mandate</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Next Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMandates.length > 0 ? (
                  filteredMandates.map((mandate) => (
                    <TableRow key={mandate.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedMandates.includes(mandate.id)}
                          onCheckedChange={(checked) => 
                            toggleSelectMandate(mandate.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{mandate.name}</div>
                        <div className="text-sm text-muted-foreground">{mandate.description}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getTypeIcon(mandate.type)}
                          <span className="capitalize">
                            {mandate.type.replace('_', ' ')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(mandate.amount, mandate.currency)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="capitalize">
                            {getFrequencyLabel(mandate.frequency)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          {formatDate(mandate.nextPaymentDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(mandate.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {mandate.status === 'active' && (
                              <DropdownMenuItem>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                              </DropdownMenuItem>
                            )}
                            {mandate.status === 'paused' && (
                              <DropdownMenuItem>
                                <Play className="h-4 w-4 mr-2" />
                                Resume
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Cancel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center py-8">
                        <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No mandates found</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Try adjusting your search or filter to find what you're looking for.
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedStatus('all');
                            setSelectedType('all');
                            setActiveTab('all');
                          }}
                        >
                          Clear filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Showing <span className="font-medium">{filteredMandates.length}</span> of{' '}
              <span className="font-medium">{mandateData.length}</span> mandates
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Create/Edit Mandate Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Create New Mandate</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsCreating(false)}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Set up a new recurring payment or subscription
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Mandate Name</Label>
                  <Input id="name" placeholder="e.g. Netflix Subscription" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Payment Type</Label>
                  <select
                    id="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="ach">ACH Transfer</option>
                    <option value="direct_debit">Direct Debit</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input 
                      id="amount" 
                      type="number" 
                      placeholder="0.00" 
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <select
                    id="frequency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly" selected>Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input id="start-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date (Optional)</Label>
                  <Input id="end-date" type="date" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input id="description" placeholder="Add a brief description" />
              </div>
              
              <div className="pt-4">
                <h4 className="font-medium mb-3">Beneficiary Details</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="beneficiary-name">Name</Label>
                    <Input id="beneficiary-name" placeholder="Recipient's name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="beneficiary-account">Account Number</Label>
                    <Input id="beneficiary-account" placeholder="Account number or last 4 digits" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="beneficiary-bank">Bank Name (Optional)</Label>
                    <Input id="beneficiary-bank" placeholder="Bank name" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="font-medium mb-3">Payment Method</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Select Account</Label>
                    <select
                      id="payment-method"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select an account</option>
                      <option value="card-1234">Visa •••• 1234 (Primary)</option>
                      <option value="card-5678">Mastercard •••• 5678</option>
                      <option value="bank-9876">Checking •••• 9876</option>
                      <option value="bank-5432">Savings •••• 5432</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Add New Payment Method</Label>
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" /> Add Payment Method
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I authorize this recurring payment and agree to the terms and conditions.
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
                <Button>Create Mandate</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
