import { useState } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { BookmarkGrid } from '@/components/bookmarks/BookmarkGrid';
import { PullToRefresh } from '@/components/mobile/PullToRefresh';
import { BottomSheet } from '@/components/mobile/BottomSheet';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import EditBookmarkSheet from '@/components/bookmarks/EditBookmarkSheet';
import MoveToCollectionSheet from '@/components/bookmarks/MoveToCollectionSheet';
import { Star, BookmarkIcon } from 'lucide-react';
import type { Bookmark } from '@/types';

export default function HomePage() {
  const {
    bookmarks,
    loading,
    toggleFavorite,
    deleteBookmark,
    refresh,
  } = useBookmarks();
  const editSheet = useBottomSheet();
  const moveSheet = useBottomSheet();

  const [filter, setFilter] = useState<'all' | 'favorite'>('all');
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    if (filter === 'favorite') return bookmark.isFavorite;
    return true; // Show all bookmarks
  });

  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await refresh();
  };

  const handleEdit = (bookmark: Bookmark) => {
    setSelectedBookmark(bookmark);
    editSheet.open();
  };

  const handleMove = (bookmark: Bookmark) => {
    setSelectedBookmark(bookmark);
    moveSheet.open();
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Bookmarks</h1>
          
          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all touch-manipulation ${
                filter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <BookmarkIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFilter('favorite')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all touch-manipulation flex items-center gap-2 ${
                filter === 'favorite'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Star className="w-4 h-4" />
            </button>
          </div>
      </header>

      {/* Content */}
      <PullToRefresh onRefresh={handleRefresh}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <BookmarkGrid
            bookmarks={filteredBookmarks}
            onToggleFavorite={toggleFavorite}
            onDelete={deleteBookmark}
            onEdit={handleEdit}
            onMove={handleMove}
          />
        )}
      </PullToRefresh>

      {/* Edit Bookmark Sheet */}
      <BottomSheet
        isOpen={editSheet.isOpen}
        onClose={editSheet.close}
        title="Edit Bookmark"
      >
        {selectedBookmark && (
          <EditBookmarkSheet
            bookmark={selectedBookmark}
            onClose={editSheet.close}
          />
        )}
      </BottomSheet>

      {/* Move to Collection Sheet */}
      <BottomSheet
        isOpen={moveSheet.isOpen}
        onClose={moveSheet.close}
        title="Move to Collection"
      >
        {selectedBookmark && (
          <MoveToCollectionSheet
            bookmark={selectedBookmark}
            onClose={moveSheet.close}
          />
        )}
      </BottomSheet>
    </div>
  );
}
