import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

type Tab = {
  name: string;
  path: string;
  icon?: React.ReactNode;
};

type TabNavigationProps = {
  tabs: Tab[];
  className?: string;
};

export function TabNavigation({ tabs, className }: TabNavigationProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className={cn("flex space-x-1 overflow-x-auto py-2 px-1", className)}>
      {tabs.map((tab) => {
        const isActive = currentPath.startsWith(tab.path);
        return (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              'flex items-center space-x-2',
              'whitespace-nowrap' // Prevent text wrapping
            )}
          >
            {tab.icon && <span className="h-4 w-4">{tab.icon}</span>}
            <span>{tab.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
