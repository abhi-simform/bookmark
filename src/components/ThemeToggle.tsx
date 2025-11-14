import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { hapticFeedback } from '@/lib/haptics';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    hapticFeedback.light();
    setTheme(newTheme);
  };

  return (
    <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <button
        onClick={() => handleThemeChange('light')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          theme === 'light'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        aria-label="Light mode"
      >
        <Sun className="w-4 h-4" />
        <span className="text-sm font-medium">Light</span>
      </button>
      <button
        onClick={() => handleThemeChange('dark')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          theme === 'dark'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        aria-label="Dark mode"
      >
        <Moon className="w-4 h-4" />
        <span className="text-sm font-medium">Dark</span>
      </button>
      <button
        onClick={() => handleThemeChange('system')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          theme === 'system'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        aria-label="System theme"
      >
        <Monitor className="w-4 h-4" />
        <span className="text-sm font-medium">System</span>
      </button>
    </div>
  );
}
