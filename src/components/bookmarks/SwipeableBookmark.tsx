import { Star, Archive, Trash2 } from 'lucide-react';
import type { Bookmark } from '@/types';
import { SwipeableCard } from '@/components/mobile/SwipeableCard';

interface SwipeableBookmarkProps {
  bookmark: Bookmark;
  onToggleFavorite: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDelete: (id: string) => void;
  children: React.ReactNode;
}

export function SwipeableBookmark({
  bookmark,
  onToggleFavorite,
  onToggleArchive,
  onDelete,
  children,
}: SwipeableBookmarkProps) {
  return (
    <SwipeableCard
      onSwipeRight={() => onToggleFavorite(bookmark.id)}
      onSwipeLeft={() => onToggleArchive(bookmark.id)}
      rightAction={{
        icon: <Star className="w-5 h-5" />,
        label: bookmark.isFavorite ? 'Unfavorite' : 'Favorite',
        color: 'bg-yellow-500 text-white',
      }}
      leftAction={{
        icon: <Archive className="w-5 h-5" />,
        label: bookmark.isArchived ? 'Unarchive' : 'Archive',
        color: 'bg-blue-500 text-white',
      }}
    >
      {children}
    </SwipeableCard>
  );
}
