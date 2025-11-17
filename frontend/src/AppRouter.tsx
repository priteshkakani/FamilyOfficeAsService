import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import MainDashboardLayout from './layouts/MainDashboardLayout';
import { lazy, Suspense } from 'react';

// Lazy load page components
const OverviewPage = lazy(() => import('./pages/dashboard/OverviewPage'));
const PortfolioPage = lazy(() => import('./pages/dashboard/PortfolioPage'));
const PlanPage = lazy(() => import('./pages/dashboard/PlanPage'));
const ActivityPage = lazy(() => import('./pages/dashboard/ActivityPage'));
const TransactionsPage = lazy(() => import('./pages/dashboard/TransactionsPage'));
const FamilyPage = lazy(() => import('./pages/dashboard/Family'));

// Import subtab components
// Overview subtabs
const AllFeedsPage = lazy(() => import('./pages/dashboard/overview/AllFeedsPage'));
const OverviewPortfolioPage = lazy(() => import('./pages/dashboard/overview/PortfolioPage'));
const OverviewTransactionsPage = lazy(() => import('./pages/dashboard/overview/TransactionsPage'));
const ProfilePage = lazy(() => import('./pages/dashboard/overview/ProfilePage'));

// Portfolio subtabs
const PortfolioSummaryPage = lazy(() => import('./pages/dashboard/portfolio/SummaryPage'));
const AssetsPage = lazy(() => import('./pages/dashboard/portfolio/AssetsPage'));
const LiabilitiesPage = lazy(() => import('./pages/dashboard/portfolio/LiabilitiesPage'));
const PortfolioInsurancePage = lazy(() => import('./pages/dashboard/portfolio/InsurancePage'));
const AnalyticsPage = lazy(() => import('./pages/dashboard/portfolio/AnalyticsPage'));

// Plan subtabs
const PlanSummaryPage = lazy(() => import('./pages/dashboard/plan/SummaryPage'));
const RatiosPage = lazy(() => import('./pages/dashboard/plan/RatiosPage'));
const CashFlowsPage = lazy(() => import('./pages/dashboard/plan/CashFlowsPage'));
const PlanInsurancePage = lazy(() => import('./pages/dashboard/plan/InsurancePage'));
const GoalsPage = lazy(() => import('./pages/dashboard/plan/GoalsPage'));

// Activity subtabs
const NotesPage = lazy(() => import('./pages/dashboard/activity/NotesPage'));
const CalculatorsPage = lazy(() => import('./pages/dashboard/activity/CalculatorsPage'));

// Transactions subtabs
const MandatesPage = lazy(() => import('./pages/dashboard/transactions/MandatesPage'));
const MutualFundsPage = lazy(() => import('./pages/dashboard/transactions/MutualFundsPage'));
const StocksPage = lazy(() => import('./pages/dashboard/transactions/StocksPage'));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard/overview" replace />,
  },
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <MainDashboardLayout />
      </Suspense>
    ),
    children: [
      // Redirect root dashboard to overview
      {
        index: true,
        element: <Navigate to="overview" replace />,
      },
      
      // Overview section with subtabs
      {
        path: 'overview',
        element: <Suspense fallback={<LoadingFallback />}><Outlet /></Suspense>,
        children: [
          { index: true, element: <Navigate to="all-feeds" replace /> },
          { path: 'all-feeds', element: <AllFeedsPage /> },
          { path: 'portfolio', element: <OverviewPortfolioPage /> },
          { path: 'transactions', element: <OverviewTransactionsPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
      
      // Portfolio section with subtabs
      {
        path: 'portfolio',
        element: <Suspense fallback={<LoadingFallback />}><Outlet /></Suspense>,
        children: [
          { index: true, element: <Navigate to="summary" replace /> },
          { path: 'summary', element: <PortfolioSummaryPage /> },
          { path: 'assets', element: <AssetsPage /> },
          { path: 'liabilities', element: <LiabilitiesPage /> },
          { path: 'insurance', element: <PortfolioInsurancePage /> },
          { path: 'analytics', element: <AnalyticsPage /> },
        ],
      },
      
      // Plan section with subtabs
      {
        path: 'plan',
        element: <Suspense fallback={<LoadingFallback />}><Outlet /></Suspense>,
        children: [
          { index: true, element: <Navigate to="summary" replace /> },
          { path: 'summary', element: <PlanSummaryPage /> },
          { path: 'ratios', element: <RatiosPage /> },
          { path: 'cash-flows', element: <CashFlowsPage /> },
          { path: 'insurance', element: <PlanInsurancePage /> },
          { path: 'goals', element: <GoalsPage /> },
        ],
      },
      
      // Activity section with subtabs
      {
        path: 'activity',
        element: <Suspense fallback={<LoadingFallback />}><Outlet /></Suspense>,
        children: [
          { index: true, element: <Navigate to="notes" replace /> },
          { path: 'notes', element: <NotesPage /> },
          { path: 'calculators', element: <CalculatorsPage /> },
        ],
      },
      
      // Transactions section with subtabs
      {
        path: 'transactions',
        element: <Suspense fallback={<LoadingFallback />}><Outlet /></Suspense>,
        children: [
          { index: true, element: <Navigate to="mandates" replace /> },
          { path: 'mandates', element: <MandatesPage /> },
          { path: 'mutual-funds', element: <MutualFundsPage /> },
          { path: 'stocks', element: <StocksPage /> },
        ],
      },
      
      // Family section (no subtabs)
      {
        path: 'family',
        element: <Suspense fallback={<LoadingFallback />}><FamilyPage /></Suspense>,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
