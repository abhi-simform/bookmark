import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, Loader2 } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useCollections } from '@/hooks/useCollections';

export default function ShareTargetPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addBookmark } = useBookmarks();
  const { collections } = useCollections();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Get shared data from URL parameters
    const sharedTitle = searchParams.get('title') || '';
    const sharedText = searchParams.get('text') || '';
    const sharedUrl = searchParams.get('url') || '';

    // Try to extract URL from text if url param is empty
    let finalUrl = sharedUrl;
    if (!finalUrl && sharedText) {
      const urlMatch = sharedText.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        finalUrl = urlMatch[0];
      }
    }

    setTitle(sharedTitle || 'Shared Link');
    setUrl(finalUrl);
    setDescription(sharedText);

    // Set default collection to Miscellaneous
    const miscCollection = collections.find(c => c.name === 'Miscellaneous');
    if (miscCollection) {
      setSelectedCollection(miscCollection.id);
    }
  }, [searchParams, collections]);

  const handleSave = async () => {
    if (!url) {
      alert('No URL to save');
      return;
    }

    setIsSaving(true);
    try {
      await addBookmark({
        url,
        title: title || 'Shared Link',
        description,
        collectionId: selectedCollection || collections[0]?.id || '',
        isFavorite: false,
      });

      // Navigate to home after saving
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error saving bookmark:', error);
      alert('Failed to save bookmark');
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSaving}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-indigo-600" />
            Save Bookmark
          </h1>
        </div>
      </header>

      {/* Form */}
      <div className="p-4 space-y-4">
        {/* URL Display */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
          <div className="text-sm text-gray-900 break-all bg-gray-50 p-3 rounded border border-gray-200">
            {url || 'No URL provided'}
          </div>
        </div>

        {/* Title Input */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter bookmark title"
            disabled={isSaving}
          />
        </div>

        {/* Description Input */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Add a description"
            disabled={isSaving}
          />
        </div>

        {/* Collection Select */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label htmlFor="collection" className="block text-sm font-medium text-gray-700 mb-2">
            Collection
          </label>
          <select
            id="collection"
            value={selectedCollection}
            onChange={e => setSelectedCollection(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            disabled={isSaving}
          >
            {collections.map(collection => (
              <option key={collection.id} value={collection.id}>
                {collection.icon} {collection.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isSaving || !url}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Bookmark'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
