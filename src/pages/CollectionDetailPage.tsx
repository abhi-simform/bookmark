import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import { useCollections } from '@/hooks/useCollections';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { BookmarkGrid } from '@/components/bookmarks/BookmarkGrid';
import { PullToRefresh } from '@/components/mobile/PullToRefresh';
import { BottomSheet } from '@/components/mobile/BottomSheet';
import EditBookmarkSheet from '@/components/bookmarks/EditBookmarkSheet';
import MoveToCollectionSheet from '@/components/bookmarks/MoveToCollectionSheet';
import { getCollectionIcon } from '@/components/collections/IconPicker';
import { getColorClass } from '@/components/collections/ColorPicker';
import type { Bookmark } from '@/types';

export default function CollectionDetailPage() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const { collections } = useCollections();
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

  const collection = collections.find((c) => c.id === collectionId);

  // Filter bookmarks by collection
  const collectionBookmarks = bookmarks.filter(
    (bookmark) => bookmark.collectionId === collectionId
  );

  const filteredBookmarks = collectionBookmarks.filter((bookmark) => {
    if (filter === 'favorite') return bookmark.isFavorite;
    return true;
  });

  const handleBack = () => {
    navigate('/collections');
  };

  const handleEdit = (bookmark: Bookmark) => {
    setSelectedBookmark(bookmark);
    editSheet.open();
  };

  const handleMove = (bookmark: Bookmark) => {
    setSelectedBookmark(bookmark);
    moveSheet.open();
  };

  if (!collection) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Collection not found</p>
        <button
          onClick={() => navigate('/collections')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Back to Collections
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 safe-top">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className={`w-10 h-10 rounded-lg ${collection.color ? getColorClass(collection.color) : 'bg-indigo-500'} flex items-center justify-center text-white flex-shrink-0`}>
            {(() => {
              const Icon = getCollectionIcon(collection.icon);
              return <Icon className="w-5 h-5" />;
            })()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{collection.name}</h1>
            {collection.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {collection.description}
              </p>
            )}
          </div>
          <button
            onClick={() => setFilter(filter === 'all' ? 'favorite' : 'all')}
            className={`p-2 rounded-lg transition-colors ${
              filter === 'favorite'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-label="Filter"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-3 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>
            {collectionBookmarks.length}{' '}
            {collectionBookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
          </span>
          {filter === 'favorite' && (
            <span className="text-primary">
              {filteredBookmarks.length} favorite
              {filteredBookmarks.length === 1 ? '' : 's'}
            </span>
          )}
        </div>
      </header>

      {/* Bookmarks List */}
      <PullToRefresh onRefresh={refresh}>
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-2xl">{collection.icon || '📚'}</span>
              </div>
              <h3 className="text-lg font-medium mb-2">
                {filter === 'favorite'
                  ? 'No favorite bookmarks'
                  : 'No bookmarks yet'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
                {filter === 'favorite'
                  ? 'Mark bookmarks as favorite to see them here'
                  : 'Tap the + button to add your first bookmark to this collection'}
              </p>
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
        </div>
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
