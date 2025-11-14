import { useState } from 'react';
import { FolderOpen } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useCollections } from '@/hooks/useCollections';
import { hapticFeedback } from '@/lib/haptics';
import type { Bookmark } from '@/types';

interface MoveToCollectionSheetProps {
  bookmark: Bookmark;
  onClose: () => void;
}

export default function MoveToCollectionSheet({ bookmark, onClose }: MoveToCollectionSheetProps) {
  const { updateBookmark } = useBookmarks();
  const { collections } = useCollections();
  const [selectedCollectionId, setSelectedCollectionId] = useState(bookmark.collectionId);
  const [isLoading, setIsLoading] = useState(false);

  const handleMove = async (collectionId: string) => {
    if (collectionId === bookmark.collectionId) {
      onClose();
      return;
    }

    setIsLoading(true);
    hapticFeedback.light();

    try {
      await updateBookmark(bookmark.id, {
        collectionId: collectionId,
      });

      hapticFeedback.success();
      onClose();
    } catch (error) {
      console.error('Failed to move bookmark:', error);
      hapticFeedback.error();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Current Bookmark Info */}
      <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold mb-1 line-clamp-1">{bookmark.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-ellipsis line-clamp-1 line-clamp-1">
          {bookmark.url}
        </p>
      </div>

      {/* Collections List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {collections.map(collection => {
          const isCurrentCollection = collection.id === bookmark.collectionId;
          const isSelected = collection.id === selectedCollectionId;

          return (
            <button
              key={collection.id}
              onClick={() => {
                setSelectedCollectionId(collection.id);
                handleMove(collection.id);
              }}
              disabled={isLoading}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all touch-manipulation ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-lg ${
                  collection.color || 'bg-primary'
                } flex items-center justify-center text-white flex-shrink-0`}
              >
                <FolderOpen className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium truncate">{collection.name}</p>
                {collection.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-ellipsis line-clamp-1 truncate">
                    {collection.description}
                  </p>
                )}
              </div>
              {isCurrentCollection && (
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  Current
                </span>
              )}
              {isSelected && !isCurrentCollection && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Cancel Button */}
      <button
        onClick={onClose}
        disabled={isLoading}
        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}
