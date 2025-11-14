import { useState } from 'react';
import { ExternalLink, Star, MoreVertical, Pencil, Trash2, FolderInput, Globe } from 'lucide-react';
import type { Bookmark } from '@/types';
import { cn, formatDate, getDomainFromUrl } from '@/lib/utils';
import { thumbnailService } from '@/lib/thumbnailService';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onToggleFavorite: (id: string) => void;
  onToggleArchive?: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (bookmark: Bookmark) => void;
  onMove?: (bookmark: Bookmark) => void;
}

export function BookmarkCard({
  bookmark,
  onToggleFavorite,
  onDelete,
  onEdit,
  onMove,
}: BookmarkCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleClick = () => {
    window.open(bookmark.url, '_blank');
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all flex cursor-pointer active:scale-[0.98]"
    >
      {/* Thumbnail */}
      <div className="w-28 h-full flex-shrink-0 bg-gray-100 dark:bg-gray-900">
        {bookmark.thumbnail ? (
          <img
            src={bookmark.thumbnail}
            alt={bookmark.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={e => {
              // If thumbnail fails to load, hide it
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Globe className="w-16 h-16 text-gray-300 dark:text-gray-600" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2 ps-3">
        {/* Header with favicon and domain */}
        <div className="flex items-center gap-2 mb-2">
          {bookmark.favicon ? (
            <img
              src={bookmark.favicon}
              alt=""
              className="w-4 h-4 rounded"
              loading="lazy"
              onError={e => {
                // If favicon fails to load, use fallback
                e.currentTarget.src = thumbnailService.getDefaultFavicon(bookmark.url);
              }}
            />
          ) : (
            <div className="w-4 h-4 rounded bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <Globe className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            </div>
          )}
          <span className="text-xs text-ellipsis line-clamp-1 text-gray-500 dark:text-gray-400 truncate">
            {getDomainFromUrl(bookmark.url)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{bookmark.title}</h3>

        {/* Description */}
        {bookmark.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {bookmark.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(bookmark.createdAt)}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={e => {
                e.stopPropagation();
                onToggleFavorite(bookmark.id);
              }}
              className={cn(
                'p-1 rounded-full transition-colors touch-manipulation',
                bookmark.isFavorite
                  ? 'text-yellow-500'
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
              aria-label={bookmark.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className="w-4 h-4" fill={bookmark.isFavorite ? 'currentColor' : 'none'} />
            </button>

            <button
              onClick={e => {
                e.stopPropagation();
                window.open(bookmark.url, '_blank');
              }}
              className="p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors touch-manipulation"
              aria-label="Open link"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Three-dot menu */}
            <div className="relative">
              <button
                onClick={e => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors touch-manipulation"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={e => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                  />
                  <div className="absolute right-0 bottom-full mb-2 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20 animate-scale-in">
                    {onEdit && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onEdit(bookmark);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left text-sm"
                      >
                        <Pencil className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    )}
                    {onMove && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onMove(bookmark);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left text-sm"
                      >
                        <FolderInput className="w-4 h-4" />
                        <span>Move to Collection</span>
                      </button>
                    )}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onDelete(bookmark.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left text-sm text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
