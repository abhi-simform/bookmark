import { Home, FolderOpen, Search, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { hapticFeedback } from '@/lib/haptics';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Home', icon: <Home className="w-6 h-6" />, path: '/' },
  { label: 'Collections', icon: <FolderOpen className="w-6 h-6" />, path: '/collections' },
  { label: 'Search', icon: <Search className="w-6 h-6" />, path: '/search' },
  { label: 'Profile', icon: <User className="w-6 h-6" />, path: '/profile' },
];

export function BottomNav() {
  const location = useLocation();

  const handleNavClick = () => {
    hapticFeedback.light();
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe-bottom z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
                'active:bg-gray-100 dark:active:bg-gray-800',
                isActive
                  ? 'text-primary'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              <div className="relative">
                {item.icon}
                {isActive && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
