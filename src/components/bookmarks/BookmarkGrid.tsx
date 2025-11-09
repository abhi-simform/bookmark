import type { Bookmark } from '@/types';
import { BookmarkCard } from './BookmarkCard';

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (bookmark: Bookmark) => void;
  onMove?: (bookmark: Bookmark) => void;
  onSelect?: (id: string) => void;
  selectedIds?: string[];
}

export function BookmarkGrid({
  bookmarks,
  onToggleFavorite,
  onDelete,
  onEdit,
  onMove,
  onSelect,
  selectedIds = [],
}: BookmarkGridProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-gray-400 dark:text-gray-600 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
          Start saving your favorite links by tapping the + button below
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
          onEdit={onEdit}
          onMove={onMove}
          onSelect={onSelect}
          isSelected={selectedIds.includes(bookmark.id)}
        />
      ))}
    </div>
  );
}
