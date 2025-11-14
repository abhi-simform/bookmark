import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCollections } from '@/hooks/useCollections';
import { useBookmarks } from '@/hooks/useBookmarks';
import { FolderOpen, Plus, MoreVertical, Pencil, Trash2, Share2 } from 'lucide-react';
import { BottomSheet } from '@/components/mobile/BottomSheet';
import { ConfirmDialog } from '@/components/mobile/ConfirmDialog';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { hapticFeedback } from '@/lib/haptics';
import {
  IconPicker,
  CollectionIconName,
  getCollectionIcon,
} from '@/components/collections/IconPicker';
import { ColorPicker, getColorClass } from '@/components/collections/ColorPicker';
import { useAuth } from '@/contexts/AuthContext';

export default function CollectionsPage() {
  const navigate = useNavigate();
  const { collections, loading, deleteCollection, updateCollection, addCollection } =
    useCollections();
  const { bookmarks } = useBookmarks();
  const addCollectionSheet = useBottomSheet();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    icon: 'folder' as CollectionIconName,
    color: '#6366f1', // Default indigo color
  });
  const [editingCollection, setEditingCollection] = useState<{
    id: string;
    name: string;
    description: string;
    icon?: string;
    color?: string;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    name: string;
    hasBookmarks: boolean;
  } | null>(null);

  // Count bookmarks per collection
  const getBookmarkCount = (collectionId: string) => {
    return bookmarks.filter(b => b.collectionId === collectionId).length;
  };

  const handleCollectionClick = (collectionId: string) => {
    hapticFeedback.light();
    navigate(`/collections/${collectionId}`);
  };

  const handleMenuClick = (e: React.MouseEvent, collectionId: string) => {
    e.stopPropagation();
    hapticFeedback.light();
    setActiveMenu(activeMenu === collectionId ? null : collectionId);
  };

  const handleRename = (collection: (typeof collections)[0]) => {
    setEditingCollection({
      id: collection.id,
      name: collection.name,
      description: collection.description || '',
      icon: collection.icon || 'folder',
      color: collection.color || '#6366f1',
    });
    setActiveMenu(null);
  };

  const handleSaveRename = async () => {
    if (!editingCollection) return;

    try {
      await updateCollection(editingCollection.id, {
        name: editingCollection.name.trim(),
        description: editingCollection.description.trim(),
        icon: editingCollection.icon,
        color: editingCollection.color,
      });
      hapticFeedback.success();
      setEditingCollection(null);
    } catch (error) {
      console.error('Failed to rename collection:', error);
      hapticFeedback.error();
    }
  };

  const handleDeleteClick = (collection: (typeof collections)[0]) => {
    const bookmarkCount = getBookmarkCount(collection.id);
    setDeleteConfirm({
      id: collection.id,
      name: collection.name,
      hasBookmarks: bookmarkCount > 0,
    });
    setActiveMenu(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteCollection(deleteConfirm.id);
      hapticFeedback.success();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete collection:', error);
      hapticFeedback.error();
    }
  };

  const handleAddCollection = async () => {
    if (!newCollection.name.trim()) return;

    try {
      await addCollection({
        name: newCollection.name.trim(),
        description: newCollection.description.trim(),
        icon: newCollection.icon,
        color: newCollection.color,
        order: collections.length,
      });
      hapticFeedback.success();
      setNewCollection({ name: '', description: '', icon: 'folder', color: '#6366f1' });
      addCollectionSheet.close();
    } catch (error) {
      console.error('Failed to add collection:', error);
      hapticFeedback.error();
    }
  };

  const { user } = useAuth();

  const handleShareCollection = (e: React.MouseEvent, collection: (typeof collections)[0]) => {
    e.stopPropagation();
    setActiveMenu(null);

    // Filter bookmarks for this collection, excluding soft-deleted ones
    const collectionBookmarks = bookmarks.filter(
      b => b.collectionId === collection.id && !b.isDeleted
    );

    const exportData = {
      version: '1.0.0',
      type: 'collection-share',
      exportedAt: new Date().toISOString(),
      sharedBy: user?.email || 'unknown',
      collection: {
        name: collection.name,
        description: collection.description,
        icon: collection.icon,
        color: collection.color,
      },
      bookmarks: collectionBookmarks,
      stats: {
        totalBookmarks: collectionBookmarks.length,
        favoriteBookmarks: collectionBookmarks.filter(b => b.isFavorite).length,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = collection.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    link.download = `collection-${fileName}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    hapticFeedback.success();
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-safe-top sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Collections</h1>
            {collections.length > 0 && (
              <button
                onClick={addCollectionSheet.open}
                className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                New
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="h-[calc(100dvh-133px)] overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
            <p className="text-sm text-gray-500 text-center max-w-xs mb-4">
              Create collections to organize your bookmarks. A default "All" collection will be
              created when you add your first bookmark.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map(collection => (
              <div
                key={collection.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow active:scale-95 cursor-pointer relative"
                onClick={() => handleCollectionClick(collection.id)}
              >
                <div
                  className={`flex items-start justify-between ${collection.description ? 'mb-3' : ''}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-lg ${collection.color ? getColorClass(collection.color) : 'bg-indigo-500'} flex items-center justify-center text-white flex-shrink-0`}
                    >
                      {(() => {
                        const Icon = getCollectionIcon(collection.icon);
                        return <Icon className="w-6 h-6" />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base truncate">{collection.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-ellipsis line-clamp-1">
                        {getBookmarkCount(collection.id)}{' '}
                        {getBookmarkCount(collection.id) === 1 ? 'bookmark' : 'bookmarks'}
                      </p>
                    </div>
                  </div>

                  {/* Three-dot menu button */}
                  <div className="relative">
                    <button
                      onClick={e => handleMenuClick(e, collection.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      aria-label="Collection options"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Dropdown Menu */}
                    {activeMenu === collection.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={e => {
                            e.stopPropagation();
                            setActiveMenu(null);
                          }}
                        />
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20 animate-scale-in">
                          <button
                            onClick={e => handleShareCollection(e, collection)}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left text-sm"
                          >
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleRename(collection);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left text-sm"
                          >
                            <Pencil className="w-4 h-4" />
                            <span>Rename</span>
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteClick(collection);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition-colors text-left"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {collection.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {collection.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rename Dialog */}
      <BottomSheet
        isOpen={!!editingCollection}
        onClose={() => setEditingCollection(null)}
        title="Rename Collection"
      >
        {editingCollection && (
          <div className="p-4 space-y-4">
            <div>
              <label htmlFor="collection-name" className="block text-sm font-medium mb-2">
                Collection Name <span className="text-red-500">*</span>
              </label>
              <input
                id="collection-name"
                type="text"
                value={editingCollection.name}
                onChange={e => setEditingCollection({ ...editingCollection, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Collection name"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="collection-description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="collection-description"
                value={editingCollection.description}
                onChange={e =>
                  setEditingCollection({ ...editingCollection, description: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Optional description"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <IconPicker
                selectedIcon={(editingCollection.icon || 'folder') as CollectionIconName}
                onSelectIcon={icon => setEditingCollection({ ...editingCollection, icon })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <ColorPicker
                selectedColor={editingCollection.color || '#6366f1'}
                onColorSelect={color => setEditingCollection({ ...editingCollection, color })}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditingCollection(null)}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRename}
                disabled={!editingCollection.name.trim()}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* Add Collection Bottom Sheet */}
      <BottomSheet
        isOpen={addCollectionSheet.isOpen}
        onClose={() => {
          addCollectionSheet.close();
          setNewCollection({ name: '', description: '', icon: 'folder', color: '#6366f1' });
        }}
        title="New Collection"
      >
        <div className="p-4 space-y-4">
          <div>
            <label htmlFor="new-collection-name" className="block text-sm font-medium mb-2">
              Collection Name <span className="text-red-500">*</span>
            </label>
            <input
              id="new-collection-name"
              type="text"
              value={newCollection.name}
              onChange={e => setNewCollection({ ...newCollection, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Food Recipes, Travel Plans"
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="new-collection-description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="new-collection-description"
              value={newCollection.description}
              onChange={e => setNewCollection({ ...newCollection, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Optional description"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <IconPicker
              selectedIcon={newCollection.icon}
              onSelectIcon={icon => setNewCollection({ ...newCollection, icon })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <ColorPicker
              selectedColor={newCollection.color}
              onColorSelect={color => setNewCollection({ ...newCollection, color })}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                addCollectionSheet.close();
                setNewCollection({ name: '', description: '', icon: 'folder', color: '#6366f1' });
              }}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCollection}
              disabled={!newCollection.name.trim()}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete "${deleteConfirm?.name}"?`}
        message={
          deleteConfirm?.hasBookmarks
            ? `This collection contains ${getBookmarkCount(deleteConfirm.id)} bookmark${
                getBookmarkCount(deleteConfirm.id) === 1 ? '' : 's'
              }. Deleting it will not delete the bookmarks, but they will need to be reassigned to another collection.`
            : 'This collection is empty and will be permanently deleted.'
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
