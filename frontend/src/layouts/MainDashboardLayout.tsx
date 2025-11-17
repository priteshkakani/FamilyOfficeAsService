import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  Home, 
  PieChart, 
  Target, 
  Activity, 
  FileText, 
  Users as UserIcon,
  BarChart2,
  TrendingUp,
  Landmark,
  ShieldCheck,
  Calculator,
  Shield,
  DollarSign
} from 'lucide-react';

// Main navigation items with icons and subtabs
const mainNavigation = [
  { 
    name: 'Overview', 
    href: '/dashboard/overview', 
    icon: Home,
    subtabs: [
      { name: 'All Feeds', href: '/dashboard/overview/all-feeds', icon: FileText },
      { name: 'Portfolio', href: '/dashboard/overview/portfolio', icon: PieChart },
      { name: 'Transactions', href: '/dashboard/overview/transactions', icon: FileText },
      { name: 'Profile', href: '/dashboard/overview/profile', icon: UserIcon },
    ]
  },
  { 
    name: 'Portfolio', 
    href: '/dashboard/portfolio', 
    icon: PieChart,
    subtabs: [
      { name: 'Summary', href: '/dashboard/portfolio/summary', icon: BarChart2 },
      { name: 'Assets', href: '/dashboard/portfolio/assets', icon: TrendingUp },
      { name: 'Liabilities', href: '/dashboard/portfolio/liabilities', icon: Landmark },
      { name: 'Insurance', href: '/dashboard/portfolio/insurance', icon: ShieldCheck },
      { name: 'Analytics', href: '/dashboard/portfolio/analytics', icon: BarChart2 },
    ]
  },
  { 
    name: 'Plan', 
    href: '/dashboard/plan', 
    icon: Target,
    subtabs: [
      { name: 'Summary', href: '/dashboard/plan/summary', icon: BarChart2 },
      { name: 'Ratios', href: '/dashboard/plan/ratios', icon: Calculator },
      { name: 'Cash Flows', href: '/dashboard/plan/cash-flows', icon: DollarSign },
      { name: 'Insurance', href: '/dashboard/plan/insurance', icon: Shield },
      { name: 'Goals', href: '/dashboard/plan/goals', icon: Target },
    ]
  },
  { 
    name: 'Activity', 
    href: '/dashboard/activity', 
    icon: Activity,
    subtabs: [
      { name: 'Notes', href: '/dashboard/activity/notes', icon: FileText },
      { name: 'Calculators', href: '/dashboard/activity/calculators', icon: Calculator },
    ]
  },
  { 
    name: 'Transactions', 
    href: '/dashboard/transactions', 
    icon: FileText,
    subtabs: [
      { name: 'Mandates', href: '/dashboard/transactions/mandates', icon: FileText },
      { name: 'Mutual Funds', href: '/dashboard/transactions/mutual-funds', icon: TrendingUp },
      { name: 'Stocks', href: '/dashboard/transactions/stocks', icon: BarChart2 },
    ]
  },
];

const MainDashboardLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Get the current main tab based on the URL
  const currentMainTab = mainNavigation.find(tab => 
    currentPath === tab.href || (tab.href !== '/dashboard/overview' && currentPath.startsWith(tab.href))
  ) || mainNavigation[0]; // Default to first tab if no match found

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">Family Office</span>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-2" data-testid="dashboard-topbar">
                {mainNavigation.map((item) => {
                  const isActive = currentPath === item.href || 
                                 (item.href !== '/dashboard/overview' && 
                                  currentPath.startsWith(item.href));
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'inline-flex items-center px-4 pt-1 border-b-2 text-sm font-medium h-full',
                        isActive
                          ? 'border-indigo-500 text-gray-900 bg-indigo-50'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50'
                      )}
                      data-testid={`nav-${item.name.toLowerCase()}`}
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button 
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                data-testid="user-menu-button"
              >
                <span className="sr-only">View profile</span>
                <UserIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          {/* Subtabs */}
          {currentMainTab?.subtabs && currentMainTab.subtabs.length > 0 && (
            <div className="border-t border-gray-200">
              <nav className="flex space-x-8 overflow-x-auto" data-testid="subtab-navigation">
                {currentMainTab.subtabs.map((subtab) => {
                  const isSubtabActive = currentPath === subtab.href || 
                                       (subtab.href !== currentMainTab.href && 
                                        currentPath.startsWith(subtab.href));
                  return (
                    <NavLink
                      key={subtab.name}
                      to={subtab.href}
                      className={cn(
                        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center',
                        isSubtabActive
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      )}
                      data-testid={`subtab-${subtab.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {subtab.icon && <subtab.icon className="mr-2 h-4 w-4" />}
                      {subtab.name}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainDashboardLayout;
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    icon: PieChart,
    subTabs: [
      { id: 'summary', label: 'Summary', icon: BarChart2, dataSource: ['vw_net_worth', 'vw_asset_allocation'] },
      { id: 'assets', label: 'Assets', icon: TrendingUp, dataSource: ['assets'] },
      { id: 'liabilities', label: 'Liabilities', icon: Landmark, dataSource: ['liabilities'] },
      { id: 'insurance', label: 'Insurance', icon: ShieldCheck, dataSource: ['insurance_policies'] },
      { id: 'analytics', label: 'Analytics', icon: BarChart2, dataSource: ['vw_portfolio_analytics'] },
    ]
  },
  {
    id: 'plan',
    label: 'Plan',
    icon: Target,
    subTabs: [
      { id: 'summary', label: 'Summary', icon: FileText, dataSource: ['financial_plan'] },
      { id: 'ratios', label: 'Ratios', icon: Calculator, dataSource: ['financial_ratios'] },
      { id: 'insurance', label: 'Insurance', icon: Shield, dataSource: ['insurance_coverage'] },
      { id: 'goals', label: 'Goals', icon: Target, dataSource: ['financial_goals'] },
    ]
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: Activity,
    subTabs: [
      { id: 'notes', label: 'Notes', icon: FileText, dataSource: ['user_notes'] },
      { id: 'calculators', label: 'Calculators', icon: Calculator },
    ]
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: FileText,
    subTabs: [
      { id: 'mandates', label: 'Mandates', icon: FileCheck, dataSource: ['mandates'] },
      { id: 'mutual-funds', label: 'Mutual Funds', icon: FileSpreadsheet, dataSource: ['mf_transactions'] },
      { id: 'stocks', label: 'Stocks', icon: TrendingUp, dataSource: ['stock_trades'] },
    ]
  },
  {
    id: 'family',
    label: 'Family',
    icon: Users,
    subTabs: [
      { id: 'members', label: 'Members', icon: UserIcon },
      { id: 'dependents', label: 'Dependents', icon: UserIcon },
    ]
  },
  {
    id: 'goals',
    label: 'Goals',
    icon: Target,
    subTabs: [
      { id: 'all', label: 'All Goals', icon: Target },
      { id: 'in-progress', label: 'In Progress', icon: ClockIcon },
      { id: 'completed', label: 'Completed', icon: CheckCircleIcon },
    ]
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: FileText,
    subTabs: [
      { id: 'personal', label: 'Personal', icon: UserIcon },
      { id: 'financial', label: 'Financial', icon: DollarSignIcon },
      { id: 'tax', label: 'Tax', icon: ReceiptIcon },
    ]
  },
  {
    id: 'recommendations',
    label: 'Recommendations',
    icon: Lightbulb,
    subTabs: []
  },
  {
    id: 'next-steps',
    label: 'Next Steps',
    icon: ListChecks,
    subTabs: []
  },
  {
    id: 'audit',
    label: 'Audit',
    icon: FileSearch,
    subTabs: []
  }
];

const MainDashboardLayout = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentTab = pathSegments[1] || 'overview';
  const currentSubTab = pathSegments[2] || '';
  const currentMainTab = useMemo(() => 
    mainTabs.find(tab => tab.id === currentTab) || mainTabs[0],
    [currentTab]
  );

  // Main navigation tabs to be displayed in the top bar
  const mainNavigationTabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'plan', label: 'Plan', icon: Target },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'transactions', label: 'Transactions', icon: FileText },
    { id: 'family', label: 'Family', icon: UserIcon }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Main Navigation Bar */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-xl font-bold mr-8">Family Office</h1>
          <nav className="flex items-center space-x-4 lg:space-x-6">
            {mainNavigationTabs.map((tab) => (
              <NavLink
                key={tab.id}
                to={`/dashboard/${tab.id}`}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Secondary Navigation */}
        {currentMainTab.subTabs && currentMainTab.subTabs.length > 0 && (
          <div className="border-t bg-muted/40">
            <div className="px-4">
              <nav className="flex space-x-4 overflow-x-auto py-2">
                {currentMainTab.subTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <NavLink
                      key={tab.id}
                      to={`/dashboard/${currentTab}/${tab.id}`}
                      className={({ isActive }) =>
                        cn(
                          'inline-flex items-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-background text-foreground shadow'
                            : 'text-muted-foreground hover:text-foreground/80 hover:bg-muted/50'
                        )
                      }
                    >
                      {Icon && <Icon className="mr-2 h-4 w-4" />}
                      {tab.label}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
                    </NavLink>
                  );
                })}
              </nav>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainDashboardLayout;
