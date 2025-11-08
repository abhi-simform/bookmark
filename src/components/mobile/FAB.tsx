import { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { hapticFeedback } from '@/lib/haptics';

interface FABProps {
  onClick: () => void;
  icon?: React.ReactNode;
  label?: string;
  actions?: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }>;
}

export function FAB({ onClick, icon, label, actions }: FABProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMainClick = () => {
    if (actions && actions.length > 0) {
      setIsExpanded(!isExpanded);
      hapticFeedback.light();
    } else {
      onClick();
      hapticFeedback.medium();
    }
  };

  const handleActionClick = (action: () => void) => {
    action();
    setIsExpanded(false);
    hapticFeedback.medium();
  };

  return (
    <>
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 z-40 animate-fade-in"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Action buttons */}
      {isExpanded && actions && (
        <div className="fixed right-4 bottom-24 z-50 flex flex-col gap-3 animate-slide-up">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action.onClick)}
              className="flex items-center gap-3 group"
            >
              <span className="bg-white dark:bg-gray-800 text-sm font-medium px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {action.label}
              </span>
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center">
                {action.icon}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={handleMainClick}
        className={cn(
          'fixed right-4 bottom-20 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg',
          'flex items-center justify-center',
          'active:scale-95 transition-all',
          'hover:shadow-xl',
          isExpanded && 'rotate-45'
        )}
        aria-label={label || 'Add'}
      >
        {icon || <Plus className="w-6 h-6" />}
      </button>
    </>
  );
}
