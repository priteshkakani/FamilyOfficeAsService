import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

type CustomRenderOptions = RenderOptions & {
  route?: string;
  initialEntries?: string[];
};

// Test Supabase client
const testSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const testSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabaseTestClient = createClient(testSupabaseUrl, testSupabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Service role client for test setup/teardown
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdminClient = serviceRoleKey 
  ? createClient(testSupabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Custom render function with router and any other providers
export const renderWithProviders = (
  ui: ReactElement,
  { route = '/', initialEntries, ...renderOptions }: CustomRenderOptions = {}
) => {
  window.history.pushState({}, 'Test page', route);
  
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );

  return {
    ...render(ui, { wrapper, ...renderOptions }),
  };
};

// Re-export everything from RTL
export * from '@testing-library/react';
// Override render method
export { renderWithProviders as render };
