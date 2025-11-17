import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calculator, DollarSign, TrendingUp, Home, Clock, Percent, Calendar, Zap } from 'lucide-react';

type CalculatorType = 'compound-interest' | 'mortgage' | 'retirement' | 'roi' | 'savings' | 'debt-payoff';

const CalculatorCard = ({ 
  title, 
  description, 
  icon: Icon, 
  active, 
  onClick 
}: { 
  title: string; 
  description: string; 
  icon: any; 
  active: boolean; 
  onClick: () => void;
}) => (
  <Card 
    className={`cursor-pointer transition-all ${active ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50'}`}
    onClick={onClick}
  >
    <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
      <div className={`p-3 rounded-lg ${active ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </div>
    </CardHeader>
  </Card>
);

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState<number>(10000);
  const [rate, setRate] = useState<number>(7);
  const [years, setYears] = useState<number>(10);
  const [compoundFrequency, setCompoundFrequency] = useState<number>(12);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [result, setResult] = useState<{
    finalAmount: number;
    interestEarned: number;
    totalContributions: number;
  } | null>(null);

  useEffect(() => {
    calculate();
  }, [principal, rate, years, compoundFrequency, monthlyContribution]);

  const calculate = () => {
    const r = rate / 100;
    const n = compoundFrequency;
    const t = years;
    const P = principal;
    const PMT = monthlyContribution;
    
    // Future value of initial investment
    const fvPrincipal = P * Math.pow(1 + r/n, n*t);
    
    // Future value of series of deposits
    const fvAnnuity = PMT * (Math.pow(1 + r/n, n*t) - 1) / (r/n);
    
    const finalAmount = fvPrincipal + fvAnnuity;
    const totalContributions = P + (PMT * n * t);
    const interestEarned = finalAmount - totalContributions;
    
    setResult({
      finalAmount,
      interestEarned,
      totalContributions
    });
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
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="principal">Initial Investment</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
              <Input
                id="principal"
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="pl-8"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="monthly-contribution">Monthly Contribution</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
              <Input
                id="monthly-contribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="pl-8"
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between">
              <Label htmlFor="rate">Annual Interest Rate</Label>
              <span className="text-sm text-muted-foreground">{rate}%</span>
            </div>
            <Slider
              id="rate"
              min={0.1}
              max={20}
              step={0.1}
              value={[rate]}
              onValueChange={([value]) => setRate(value)}
              className="mt-4"
            />
          </div>
          
          <div>
            <div className="flex justify-between">
              <Label htmlFor="years">Time Period</Label>
              <span className="text-sm text-muted-foreground">{years} years</span>
            </div>
            <Slider
              id="years"
              min={1}
              max={50}
              step={1}
              value={[years]}
              onValueChange={([value]) => setYears(value)}
              className="mt-4"
            />
          </div>
          
          <div>
            <Label>Compounding Frequency</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[
                { value: 1, label: 'Annually' },
                { value: 4, label: 'Quarterly' },
                { value: 12, label: 'Monthly' },
                { value: 365, label: 'Daily' },
              ].map(({ value, label }) => (
                <Button
                  key={value}
                  variant={compoundFrequency === value ? 'default' : 'outline'}
                  onClick={() => setCompoundFrequency(value)}
                  className="h-10"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {result && (
          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-3xl">{formatCurrency(result.finalAmount)}</CardTitle>
                <CardDescription>Total Value</CardDescription>
              </CardHeader>
            </Card>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Interest Earned</p>
                  <p className="text-lg font-medium">{formatCurrency(result.interestEarned)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Contributions</p>
                  <p className="text-lg font-medium">{formatCurrency(result.totalContributions)}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Yearly Breakdown</p>
                  <p className="text-sm text-muted-foreground">Balance</p>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {Array.from({ length: years + 1 }).map((_, i) => {
                    const year = i;
                    const r = rate / 100;
                    const n = compoundFrequency;
                    const t = year;
                    const P = principal;
                    const PMT = monthlyContribution;
                    
                    const fvPrincipal = P * Math.pow(1 + r/n, n*t);
                    const fvAnnuity = PMT * (Math.pow(1 + r/n, n*t) - 1) / (r/n);
                    const balance = fvPrincipal + fvAnnuity;
                    
                    return (
                      <div key={year} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Year {year}</span>
                        <span className="font-medium">{formatCurrency(balance)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MortgageCalculator = () => {
  const [homePrice, setHomePrice] = useState<number>(500000);
  const [downPayment, setDownPayment] = useState<number>(100000);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [propertyTax, setPropertyTax] = useState<number>(1.2);
  const [homeInsurance, setHomeInsurance] = useState<number>(1200);
  const [hoaFees, setHoaFees] = useState<number>(0);
  const [includePmi, setIncludePmi] = useState<boolean>(false);
  const [pmiRate, setPmiRate] = useState<number>(0.5);
  
  const calculatePayment = () => {
    const loanAmount = homePrice - downPayment;
    const monthlyInterestRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTerm * 12;
    
    // Calculate monthly mortgage payment
    const monthlyPayment = loanAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    // Calculate PMI if down payment is less than 20%
    const pmi = (loanAmount > homePrice * 0.8 && includePmi) ? 
      (loanAmount * (pmiRate / 100)) / 12 : 0;
    
    // Calculate property tax and insurance
    const monthlyPropertyTax = (homePrice * (propertyTax / 100)) / 12;
    const monthlyHomeInsurance = homeInsurance / 12;
    
    const totalMonthlyPayment = monthlyPayment + pmi + monthlyPropertyTax + monthlyHomeInsurance + (hoaFees || 0);
    
    return {
      monthlyPayment,
      pmi,
      monthlyPropertyTax,
      monthlyHomeInsurance,
      totalMonthlyPayment,
      loanAmount,
      totalInterest: (monthlyPayment * numberOfPayments) - loanAmount,
      totalCost: (monthlyPayment * numberOfPayments) + downPayment + 
                (monthlyPropertyTax * 12 * loanTerm) + 
                (homeInsurance * loanTerm) +
                (pmi * 12 * (loanTerm - Math.ceil((1 - (downPayment / homePrice)) * 100 / (100/loanTerm)))),
    };
  };
  
  const results = calculatePayment();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="home-price">Home Price</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
              <Input
                id="home-price"
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="pl-8"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="down-payment">Down Payment</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="down-payment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="pl-8"
                />
              </div>
              <div className="relative">
                <Input
                  type="number"
                  value={Math.round((downPayment / homePrice) * 100 * 100) / 100}
                  onChange={(e) => {
                    const percent = Number(e.target.value);
                    if (percent >= 0 && percent <= 100) {
                      setDownPayment(Math.round((percent / 100) * homePrice));
                    }
                  }}
                  className="pr-12"
                />
                <span className="absolute right-3 top-2.5 text-muted-foreground">%</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between">
              <Label htmlFor="loan-term">Loan Term</Label>
              <span className="text-sm text-muted-foreground">{loanTerm} years</span>
            </div>
            <Slider
              id="loan-term"
              min={10}
              max={30}
              step={5}
              value={[loanTerm]}
              onValueChange={([value]) => setLoanTerm(value)}
              className="mt-4"
            />
          </div>
          
          <div>
            <div className="flex justify-between">
              <Label htmlFor="interest-rate">Interest Rate</Label>
              <span className="text-sm text-muted-foreground">{interestRate}%</span>
            </div>
            <Slider
              id="interest-rate"
              min={2}
              max={12}
              step={0.125}
              value={[interestRate]}
              onValueChange={([value]) => setInterestRate(value)}
              className="mt-4"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Additional Costs</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property-tax" className="text-xs">Property Tax (annual %)</Label>
                <div className="relative">
                  <Input
                    id="property-tax"
                    type="number"
                    step="0.01"
                    value={propertyTax}
                    onChange={(e) => setPropertyTax(Number(e.target.value))}
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-2.5 text-muted-foreground">%</span>
                </div>
              </div>
              <div>
                <Label htmlFor="home-insurance" className="text-xs">Home Insurance (annual)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    id="home-insurance"
                    type="number"
                    value={homeInsurance}
                    onChange={(e) => setHomeInsurance(Number(e.target.value))}
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="hoa-fees" className="text-xs">HOA Fees (monthly)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    id="hoa-fees"
                    type="number"
                    value={hoaFees}
                    onChange={(e) => setHoaFees(Number(e.target.value))}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div>
              <Label htmlFor="pmi" className="text-sm font-medium">Private Mortgage Insurance (PMI)</Label>
              <p className="text-xs text-muted-foreground">
                {downPayment < homePrice * 0.2 
                  ? 'Required for down payments < 20%' 
                  : 'Not required (down payment ≥ 20%)'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {downPayment < homePrice * 0.2 && (
                <div className="relative w-20">
                  <Input
                    id="pmi-rate"
                    type="number"
                    step="0.01"
                    value={pmiRate}
                    onChange={(e) => setPmiRate(Number(e.target.value))}
                    className="pr-8"
                    disabled={!includePmi}
                  />
                  <span className="absolute right-2 top-2.5 text-muted-foreground text-sm">%</span>
                </div>
              )}
              <Switch 
                id="pmi" 
                checked={includePmi && downPayment < homePrice * 0.2}
                onCheckedChange={(checked) => setIncludePmi(checked && downPayment < homePrice * 0.2)}
                disabled={downPayment >= homePrice * 0.2}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-3xl">{formatCurrency(results.totalMonthlyPayment)}</CardTitle>
              <CardDescription>Estimated Monthly Payment</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Principal & Interest</span>
                  <span className="text-sm font-medium">{formatCurrency(results.monthlyPayment)}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${(results.monthlyPayment / results.totalMonthlyPayment) * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Property Tax</span>
                  <span className="text-sm font-medium">{formatCurrency(results.monthlyPropertyTax)}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${(results.monthlyPropertyTax / results.totalMonthlyPayment) * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Home Insurance</span>
                  <span className="text-sm font-medium">{formatCurrency(results.monthlyHomeInsurance)}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500" 
                    style={{ width: `${(results.monthlyHomeInsurance / results.totalMonthlyPayment) * 100}%` }}
                  />
                </div>
              </div>
              
              {results.pmi > 0 && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">PMI</span>
                    <span className="text-sm font-medium">{formatCurrency(results.pmi)}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500" 
                      style={{ width: `${(results.pmi / results.totalMonthlyPayment) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              {hoaFees > 0 && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">HOA Fees</span>
                    <span className="text-sm font-medium">{formatCurrency(hoaFees)}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-pink-500" 
                      style={{ width: `${(hoaFees / results.totalMonthlyPayment) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Loan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Loan Amount</span>
                <span className="text-sm font-medium">{formatCurrency(results.loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Down Payment</span>
                <span className="text-sm font-medium">{formatCurrency(downPayment)} ({formatPercent((downPayment / homePrice) * 100)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Interest Paid</span>
                <span className="text-sm font-medium">{formatCurrency(results.totalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Cost of Loan</span>
                <span className="text-sm font-medium">{formatCurrency(results.totalCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Loan Pay-off Date</span>
                <span className="text-sm font-medium">
                  {new Date(new Date().getFullYear() + loanTerm, new Date().getMonth(), new Date().getDate()).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const RetirementCalculator = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium mb-2">Retirement Calculator</h3>
        <p className="text-muted-foreground">Coming soon! This calculator will help you plan for retirement.</p>
      </div>
    </div>
  );
};

const RoiCalculator = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium mb-2">ROI Calculator</h3>
        <p className="text-muted-foreground">Coming soon! Calculate your return on investment.</p>
      </div>
    </div>
  );
};

const SavingsCalculator = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium mb-2">Savings Calculator</h3>
        <p className="text-muted-foreground">Coming soon! Plan your savings goals.</p>
      </div>
    </div>
  );
};

const DebtPayoffCalculator = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium mb-2">Debt Payoff Calculator</h3>
        <p className="text-muted-foreground">Coming soon! Create a plan to pay off your debts.</p>
      </div>
    </div>
  );
};

export default function CalculatorsPage() {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('compound-interest');
  
  const calculators = [
    {
      id: 'compound-interest',
      title: 'Compound Interest',
      description: 'Calculate investment growth over time',
      icon: TrendingUp,
      component: <CompoundInterestCalculator />,
    },
    {
      id: 'mortgage',
      title: 'Mortgage',
      description: 'Estimate monthly payments and costs',
      icon: Home,
      component: <MortgageCalculator />,
    },
    {
      id: 'retirement',
      title: 'Retirement',
      description: 'Plan your retirement savings',
      icon: Clock,
      component: <RetirementCalculator />,
    },
    {
      id: 'roi',
      title: 'ROI',
      description: 'Calculate return on investment',
      icon: Percent,
      component: <RoiCalculator />,
    },
    {
      id: 'savings',
      title: 'Savings',
      description: 'Plan your savings goals',
      icon: DollarSign,
      component: <SavingsCalculator />,
    },
    {
      id: 'debt-payoff',
      title: 'Debt Payoff',
      description: 'Create a debt repayment plan',
      icon: Zap,
      component: <DebtPayoffCalculator />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Financial Calculators</h1>
        <p className="text-muted-foreground">Make informed financial decisions with our suite of calculators</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {calculators.map((calculator) => (
          <CalculatorCard
            key={calculator.id}
            title={calculator.title}
            description={calculator.description}
            icon={calculator.icon}
            active={activeCalculator === calculator.id}
            onClick={() => setActiveCalculator(calculator.id as CalculatorType)}
          />
        ))}
      </div>
      
      <Card className="mt-6
        <CardContent className="p-6">
          {calculators.find(c => c.id === activeCalculator)?.component}
        </CardContent>
      </Card>
    </div>
  );
}
