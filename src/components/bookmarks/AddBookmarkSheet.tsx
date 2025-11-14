import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useCollections } from '@/hooks/useCollections';
import { fetchMetadata, isValidUrl } from '@/lib/metadata';
import { hapticFeedback } from '@/lib/haptics';
import { BottomSheet } from '@/components/mobile/BottomSheet';
import { IconPicker, CollectionIconName } from '@/components/collections/IconPicker';
import { ColorPicker } from '@/components/collections/ColorPicker';

interface AddBookmarkSheetProps {
  onClose: () => void;
}

export default function AddBookmarkSheet({ onClose }: AddBookmarkSheetProps) {
  const { addBookmark } = useBookmarks();
  const { collections, addCollection } = useCollections();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [showNewCollectionSheet, setShowNewCollectionSheet] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    icon: 'folder' as CollectionIconName,
    color: '#6366f1',
  });
  // Note: No auto-selection of collection - user must choose explicitly

  // Auto-fetch metadata when URL changes
  useEffect(() => {
    const fetchMetadataAuto = async () => {
      if (url && isValidUrl(url)) {
        setIsFetchingMetadata(true);
        try {
          const metadata = await fetchMetadata(url);
          setTitle(metadata.title);
          setDescription(metadata.description || '');
        } catch (error) {
          console.error('Failed to fetch metadata:', error);
        } finally {
          setIsFetchingMetadata(false);
        }
      }
    };

    const timer = setTimeout(() => {
      fetchMetadataAuto();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timer);
  }, [url]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      hapticFeedback.light();
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  const handleAddCollection = async () => {
    if (!newCollection.name.trim()) return;

    try {
      const createdCollection = await addCollection({
        name: newCollection.name.trim(),
        description: newCollection.description.trim(),
        icon: newCollection.icon,
        color: newCollection.color,
        order: collections.length,
      });

      hapticFeedback.success();
      // Set the newly created collection as selected
      setCollectionId(createdCollection.id);
      // Reset and close the sheet
      setNewCollection({ name: '', description: '', icon: 'folder', color: '#6366f1' });
      setShowNewCollectionSheet(false);
    } catch (err) {
      console.error('Failed to add collection:', err);
      hapticFeedback.error();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim() || !collectionId) return;

    setIsLoading(true);
    hapticFeedback.light();

    try {
      const metadata = await fetchMetadata(url.trim());

      await addBookmark({
        url: url.trim(),
        title: title.trim(),
        description: description.trim(),
        favicon: metadata.favicon,
        thumbnail: metadata.thumbnail,
        collectionId: collectionId,
        isFavorite: false,
      });

      hapticFeedback.success();
      setUrl('');
      setTitle('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Failed to add bookmark:', error);
      hapticFeedback.error();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      {/* URL Field */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium mb-2">
          Link <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            id="url"
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-primary focus:border-transparent"
            autoFocus
            disabled={isLoading}
            required
          />
          <button
            type="button"
            onClick={handlePaste}
            className="px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
            disabled={isLoading}
          >
            Paste
          </button>
        </div>
        {isFetchingMetadata && (
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            Fetching metadata...
          </p>
        )}
      </div>

      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Bookmark title"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={isLoading || isFetchingMetadata}
          required
        />
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Optional description"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          disabled={isLoading || isFetchingMetadata}
        />
      </div>

      {/* Collection Select */}
      <div>
        <label htmlFor="collection" className="block text-sm font-medium mb-2">
          Collection <span className="text-red-500">*</span>
        </label>
        {collections.length === 0 ? (
          <div className="space-y-2">
            <div className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400">
              No collections yet. Create one to organize your bookmarks.
            </div>
            <button
              type="button"
              onClick={() => setShowNewCollectionSheet(true)}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Create Collection
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <select
              id="collection"
              value={collectionId}
              onChange={e => {
                const value = e.target.value;
                if (value === 'ADD_NEW') {
                  setShowNewCollectionSheet(true);
                } else {
                  setCollectionId(value);
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isLoading}
              required
            >
              <option value="">Select a collection</option>
              {collections.map(collection => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
              <option value="ADD_NEW">➕ Add new collection</option>
            </select>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!url.trim() || !title.trim() || !collectionId || isLoading || isFetchingMetadata}
        className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            Add Bookmark
          </>
        )}
      </button>

      {/* New Collection Bottom Sheet */}
      <BottomSheet
        isOpen={showNewCollectionSheet}
        onClose={() => {
          setShowNewCollectionSheet(false);
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
              placeholder="Collection name"
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
              type="button"
              onClick={() => {
                setShowNewCollectionSheet(false);
                setNewCollection({ name: '', description: '', icon: 'folder', color: '#6366f1' });
              }}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddCollection}
              disabled={!newCollection.name.trim()}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </div>
      </BottomSheet>
    </form>
  );
}
