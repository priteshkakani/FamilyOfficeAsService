import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter, useLocation } from 'react-router-dom';
import useSectionState from '../useSectionState';

// Mock the useParams and useLocation hooks
const mockUseParams = jest.fn();
const mockUseLocation = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockUseParams(),
  useLocation: () => mockUseLocation(),
}));

describe('useSectionState', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>{children}</MemoryRouter>
  );

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementations
    mockUseParams.mockReturnValue({});
    mockUseLocation.mockReturnValue({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });
  });

  it('should return default values when no params are provided', () => {
    const { result } = renderHook(() => useSectionState(), { wrapper });
    
    expect(result.current.section).toBe('overview');
    expect(result.current.subtab).toBeUndefined();
  });

  it('should return the correct section when provided in params', () => {
    mockUseParams.mockReturnValue({ section: 'assets' });
    
    const { result } = renderHook(() => useSectionState(), { wrapper });
    
    expect(result.current.section).toBe('assets');
    expect(result.current.subtab).toBeUndefined();
  });

  it('should return the correct section and subtab when both are provided', () => {
    mockUseParams.mockReturnValue({ section: 'assets', subtab: 'stocks' });
    
    const { result } = renderHook(() => useSectionState(), { wrapper });
    
    expect(result.current.section).toBe('assets');
    expect(result.current.subtab).toBe('stocks');
  });

  it('should correctly identify active section with isActive', () => {
    mockUseParams.mockReturnValue({ section: 'assets' });
    
    const { result } = renderHook(() => useSectionState(), { wrapper });
    
    // Test single section
    expect(result.current.isActive('assets')).toBe(true);
    expect(result.current.isActive('liabilities')).toBe(false);
    
    // Test array of sections
    expect(result.current.isActive(['assets', 'liabilities'])).toBe(true);
    expect(result.current.isActive(['goals', 'insurance'])).toBe(false);
  });

  it('should correctly identify active subtab with isActive', () => {
    mockUseParams.mockReturnValue({ section: 'assets', subtab: 'stocks' });
    
    const { result } = renderHook(() => useSectionState(), { wrapper });
    
    // Test with both section and subtab
    expect(result.current.isActive('assets', 'stocks')).toBe(true);
    expect(result.current.isActive('assets', 'bonds')).toBe(false);
    expect(result.current.isActive('liabilities', 'stocks')).toBe(false);
  });

  it('should handle invalid section values', () => {
    // @ts-expect-error - Testing invalid input
    mockUseParams.mockReturnValue({ section: 'invalid-section' });
    
    const { result } = renderHook(() => useSectionState(), { wrapper });
    
    // Should default to 'overview' when section is invalid
    expect(result.current.section).toBe('overview');
  });
});
