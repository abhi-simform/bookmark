import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { BookmarkGrid } from '@/components/bookmarks/BookmarkGrid';
import { BottomSheet } from '@/components/mobile/BottomSheet';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import EditBookmarkSheet from '@/components/bookmarks/EditBookmarkSheet';
import MoveToCollectionSheet from '@/components/bookmarks/MoveToCollectionSheet';
import type { Bookmark } from '@/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { bookmarks, toggleFavorite, toggleArchive, deleteBookmark } = useBookmarks();
  const editSheet = useBottomSheet();
  const moveSheet = useBottomSheet();
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);

  const handleClear = () => {
    setQuery('');
  };

  const handleEdit = (bookmark: Bookmark) => {
    setSelectedBookmark(bookmark);
    editSheet.open();
  };

  const handleMove = (bookmark: Bookmark) => {
    setSelectedBookmark(bookmark);
    moveSheet.open();
  };

  // Search bookmarks by title, description, URL
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase().trim();
    
    return bookmarks.filter((bookmark) => {
      if (bookmark.isArchived) return false;
      
      const titleMatch = bookmark.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = bookmark.description?.toLowerCase().includes(searchTerm);
      const urlMatch = bookmark.url.toLowerCase().includes(searchTerm);
      
      return titleMatch || descriptionMatch || urlMatch;
    });
  }, [bookmarks, query]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-safe-top sticky top-0 z-40">
        <div className="px-4 py-4">
          
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bookmarks..."
              className="w-full pl-10 pr-20 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-primary focus:border-transparent"
              autoFocus
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {!query ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Search className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Search your bookmarks</h3>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              Find bookmarks by title, description, or URL
            </p>
          </div>
        ) : searchResults.length > 0 ? (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Found {searchResults.length} {searchResults.length === 1 ? 'bookmark' : 'bookmarks'}
            </p>
            <BookmarkGrid
              bookmarks={searchResults}
              onEdit={handleEdit}
              onMove={handleMove}
              onToggleFavorite={toggleFavorite}
              onToggleArchive={toggleArchive}
              onDelete={deleteBookmark}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Search className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              No bookmarks match "{query}"
            </p>
          </div>
        )}
      </div>

      {/* Edit Bookmark Sheet */}
      <BottomSheet
        isOpen={editSheet.isOpen}
        onClose={editSheet.close}
        title="Edit Bookmark"
      >
        {selectedBookmark && (
          <EditBookmarkSheet bookmark={selectedBookmark} onClose={editSheet.close} />
        )}
      </BottomSheet>

      {/* Move to Collection Sheet */}
      <BottomSheet
        isOpen={moveSheet.isOpen}
        onClose={moveSheet.close}
        title="Move to Collection"
      >
        {selectedBookmark && (
          <MoveToCollectionSheet bookmark={selectedBookmark} onClose={moveSheet.close} />
        )}
      </BottomSheet>
    </div>
  );
}
