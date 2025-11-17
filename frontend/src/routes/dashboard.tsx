import { RouteObject } from 'react-router-dom';
import React from 'react';
// Import layout
import MainDashboardLayout from '../layouts/MainDashboardLayout';

// Import pages
const Overview = React.lazy(() => import('../pages/dashboard/Overview'));
const Portfolio = React.lazy(() => import('../pages/dashboard/Portfolio'));
const PlanPage = React.lazy(() => import('../pages/dashboard/PlanPage'));
const Activity = React.lazy(() => import('../pages/dashboard/Activity'));
const TransactionsPage = React.lazy(() => import('../pages/dashboard/TransactionsPage'));
// Import components directly to avoid dynamic import issues
import Family from '../pages/dashboard/Family';
import Goals from '../pages/dashboard/Goals';
const Documents = React.lazy(() => import('../pages/dashboard/Documents'));
const Recommendations = React.lazy(() => import('../pages/dashboard/Recommendations'));
const NextSteps = React.lazy(() => import('../pages/dashboard/NextSteps'));
const Audit = React.lazy(() => import('../pages/dashboard/Audit'));

const dashboardRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <MainDashboardLayout />,
    children: [
      { 
        index: true, 
        element: <React.Suspense fallback={<div>Loading...</div>}><Overview /></React.Suspense> 
      },
      { 
        path: 'overview', 
        element: <React.Suspense fallback={<div>Loading...</div>}><Overview /></React.Suspense> 
      },
      { 
        path: 'portfolio', 
        element: <React.Suspense fallback={<div>Loading...</div>}><Portfolio /></React.Suspense> 
      },
      { 
        path: 'plan', 
        element: <React.Suspense fallback={<div>Loading...</div>}><PlanPage /></React.Suspense> 
      },
      { 
        path: 'activity', 
        element: <React.Suspense fallback={<div>Loading...</div>}><Activity /></React.Suspense> 
      },
      { 
        path: 'transactions', 
        element: <React.Suspense fallback={<div>Loading...</div>}><TransactionsPage /></React.Suspense> 
      },
      { 
        path: 'family', 
        element: <Family /> 
      },
      { 
        path: 'goals', 
        element: <Goals />
      },
      { 
        path: 'documents', 
        element: <React.Suspense fallback={<div>Loading...</div>}><Documents /></React.Suspense> 
      },
      { 
        path: 'recommendations', 
        element: <React.Suspense fallback={<div>Loading...</div>}><Recommendations /></React.Suspense> 
      },
      { 
        path: 'next-steps', 
        element: <React.Suspense fallback={<div>Loading...</div>}><NextSteps /></React.Suspense> 
      },
      { 
        path: 'audit', 
        element: <React.Suspense fallback={<div>Loading...</div>}><Audit /></React.Suspense> 
      },
    ],
  },
];

export default dashboardRoutes;
