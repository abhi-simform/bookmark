import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useCollections } from '@/hooks/useCollections';
import { hapticFeedback } from '@/lib/haptics';
import type { Bookmark } from '@/types';

interface EditBookmarkSheetProps {
  bookmark: Bookmark;
  onClose: () => void;
}

export default function EditBookmarkSheet({ bookmark, onClose }: EditBookmarkSheetProps) {
  const { updateBookmark } = useBookmarks();
  const { collections } = useCollections();
  const [title, setTitle] = useState(bookmark.title);
  const [description, setDescription] = useState(bookmark.description || '');
  const [url, setUrl] = useState(bookmark.url);
  const [collectionId, setCollectionId] = useState(bookmark.collectionId);
  const [tags, setTags] = useState(bookmark.tags.join(', '));
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim() || !collectionId) return;

    setIsLoading(true);
    hapticFeedback.light();

    try {
      await updateBookmark(bookmark.id, {
        url: url.trim(),
        title: title.trim(),
        description: description.trim(),
        collectionId: collectionId,
        tags: tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0),
      });

      hapticFeedback.success();
      onClose();
    } catch (error) {
      console.error('Failed to update bookmark:', error);
      hapticFeedback.error();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      {/* URL Field */}
      <div>
        <label htmlFor="edit-url" className="block text-sm font-medium mb-2">
          Link <span className="text-red-500">*</span>
        </label>
        <input
          id="edit-url"
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={isLoading}
          required
        />
      </div>

      {/* Title Field */}
      <div>
        <label htmlFor="edit-title" className="block text-sm font-medium mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="edit-title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Bookmark title"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={isLoading}
          required
        />
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="edit-description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          id="edit-description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Optional description"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          disabled={isLoading}
        />
      </div>

      {/* Collection Select */}
      <div>
        <label htmlFor="edit-collection" className="block text-sm font-medium mb-2">
          Collection <span className="text-red-500">*</span>
        </label>
        <select
          id="edit-collection"
          value={collectionId}
          onChange={e => setCollectionId(e.target.value)}
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
        </select>
      </div>

      {/* Tags Field */}
      <div>
        <label htmlFor="edit-tags" className="block text-sm font-medium mb-2">
          Tags
        </label>
        <input
          id="edit-tags"
          type="text"
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="tag1, tag2, tag3"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate tags with commas</p>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!url.trim() || !title.trim() || !collectionId || isLoading}
          className="flex-1 px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
