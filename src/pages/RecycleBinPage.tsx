import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Folder,
  Bookmark as BookmarkIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as db from '@/lib/db';
import { syncService } from '@/lib/sync';
import type { Bookmark, Collection } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function RecycleBinPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deletedBookmarks, setDeletedBookmarks] = useState<Bookmark[]>([]);
  const [deletedCollections, setDeletedCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'collections'>('bookmarks');

  useEffect(() => {
    loadDeletedItems();
  }, []);

  const loadDeletedItems = async () => {
    try {
      setLoading(true);
      const [bookmarks, collections] = await Promise.all([
        db.getDeletedBookmarks(),
        db.getDeletedCollections(),
      ]);
      setDeletedBookmarks(bookmarks);
      setDeletedCollections(collections);
    } catch (error) {
      console.error('Error loading deleted items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreBookmark = async (id: string) => {
    try {
      await db.restoreBookmark(id);

      // Sync to cloud if user is logged in
      if (user) {
        await syncService.syncBookmarksToCloud(user.id);
      }

      setDeletedBookmarks(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error restoring bookmark:', error);
    }
  };

  const handleRestoreCollection = async (id: string) => {
    try {
      await db.restoreCollection(id);

      // Sync to cloud if user is logged in
      if (user) {
        await syncService.syncCollectionsToCloud(user.id);
      }

      setDeletedCollections(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error restoring collection:', error);
    }
  };

  const handlePermanentDeleteBookmark = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to permanently delete this bookmark? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await db.permanentlyDeleteBookmark(id);

      // Delete from cloud if user is logged in
      if (user) {
        await syncService.deleteBookmarkFromCloud(user.id, id);
      }

      setDeletedBookmarks(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error permanently deleting bookmark:', error);
    }
  };

  const handlePermanentDeleteCollection = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to permanently delete this collection? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await db.permanentlyDeleteCollection(id);

      // Delete from cloud if user is logged in
      if (user) {
        await syncService.deleteCollectionFromCloud(user.id, id);
      }

      setDeletedCollections(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error permanently deleting collection:', error);
    }
  };

  const handleEmptyRecycleBin = async () => {
    if (
      !confirm(
        'Are you sure you want to permanently delete all items in the recycle bin? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await db.emptyRecycleBin();

      // Sync to cloud if user is logged in
      if (user) {
        await Promise.all([
          syncService.syncBookmarksToCloud(user.id),
          syncService.syncCollectionsToCloud(user.id),
        ]);
      }

      setDeletedBookmarks([]);
      setDeletedCollections([]);
    } catch (error) {
      console.error('Error emptying recycle bin:', error);
    }
  };

  const getDaysRemaining = (deletedAt?: number) => {
    if (!deletedAt) return 7;
    const daysPassed = Math.floor((Date.now() - deletedAt) / (24 * 60 * 60 * 1000));
    return Math.max(0, 7 - daysPassed);
  };

  const totalItems = deletedBookmarks.length + deletedCollections.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Recycle Bin</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-ellipsis line-clamp-1">
                  Items will be automatically deleted after 7 days
                </p>
              </div>
            </div>
            {totalItems > 0 && (
              <button
                onClick={handleEmptyRecycleBin}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Empty Bin
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'bookmarks'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Bookmarks ({deletedBookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'collections'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Collections ({deletedCollections.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : totalItems === 0 ? (
          <div className="text-center py-12">
            <Trash2 className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Recycle bin is empty
            </h3>
            <p className="text-gray-500 dark:text-gray-400">Deleted items will appear here</p>
          </div>
        ) : (
          <>
            {/* Warning Banner */}
            <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-amber-900 dark:text-amber-100 text-ellipsis">
                    Items will be automatically deleted after 7 days
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1 text-ellipsis">
                    Restore items before they are permanently removed from the recycle bin.
                  </p>
                </div>
              </div>
            </div>

            {/* Bookmarks Tab */}
            {activeTab === 'bookmarks' && (
              <div className="space-y-3">
                {deletedBookmarks.map(bookmark => (
                  <div
                    key={bookmark.id}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <BookmarkIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {bookmark.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-ellipsis line-clamp-1 truncate mt-1">
                          {bookmark.url}
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
                          {getDaysRemaining(bookmark.deletedAt)} days remaining
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRestoreBookmark(bookmark.id)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Restore"
                        >
                          <RefreshCw className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handlePermanentDeleteBookmark(bookmark.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete permanently"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Collections Tab */}
            {activeTab === 'collections' && (
              <div className="space-y-3">
                {deletedCollections.map(collection => (
                  <div
                    key={collection.id}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: collection.color || '#6366f1' }}
                      >
                        <Folder className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {collection.name}
                        </h3>
                        {collection.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-ellipsis line-clamp-1 mt-1">
                            {collection.description}
                          </p>
                        )}
                        <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
                          {getDaysRemaining(collection.deletedAt)} days remaining
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRestoreCollection(collection.id)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Restore"
                        >
                          <RefreshCw className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handlePermanentDeleteCollection(collection.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete permanently"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
