import { useState, useRef } from 'react';
import { Edit2, Download, Upload, LogOut, X, Check, RefreshCw, Cloud } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useCollections } from '@/hooks/useCollections';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from '@/components/mobile/BottomSheet';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { syncService } from '@/lib/sync';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { bookmarks, addBookmark } = useBookmarks();
  const { collections, addCollection } = useCollections();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [userName, setUserName] = useState(user?.user_metadata?.name || '');
  const [editNameValue, setEditNameValue] = useState(userName);
  const [syncing, setSyncing] = useState(false);
  
  const editNameSheet = useBottomSheet();

  // Manual sync trigger
  const handleManualSync = async () => {
    if (!user) return;
    
    setSyncing(true);
    try {
      await syncService.fullSync(user.id);
      alert('Sync completed successfully!');
    } catch (error) {
      console.error('Sync error:', error);
      alert('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (userName) {
      return userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Handle name save
  const handleSaveName = async () => {
    // TODO: Update user metadata in Supabase
    setUserName(editNameValue);
    editNameSheet.close();
  };

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  // Handle export bookmarks
  const handleExport = () => {
    const exportData = {
      bookmarks,
      collections,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookmarks-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle import bookmarks
  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Import collections first
      if (data.collections && Array.isArray(data.collections)) {
        for (const collection of data.collections) {
          // Skip if it's the default Miscellaneous collection
          if (collection.name !== 'Miscellaneous') {
            await addCollection({
              name: collection.name,
              description: collection.description || '',
              color: collection.color || '#6366f1',
              icon: collection.icon,
              order: collection.order || 0,
            });
          }
        }
      }

      // Import bookmarks
      if (data.bookmarks && Array.isArray(data.bookmarks)) {
        for (const bookmark of data.bookmarks) {
          await addBookmark({
            url: bookmark.url,
            title: bookmark.title || 'Imported Bookmark',
            description: bookmark.description || '',
            collectionId: bookmark.collectionId,
            tags: bookmark.tags || [],
            favicon: bookmark.favicon,
            isFavorite: bookmark.isFavorite || false,
            isArchived: bookmark.isArchived || false,
            type: bookmark.type || 'link',
            platform: bookmark.platform || 'web',
          });
        }
      }

      alert(`Successfully imported ${data.bookmarks?.length || 0} bookmarks and ${data.collections?.length || 0} collections!`);
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import bookmarks. Please check the file format.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-safe-top sticky top-0 z-40">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-safe-bottom">
        {/* User info */}
        <div className="bg-white dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {getInitials()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">
                  {userName || user?.email?.split('@')[0] || 'User'}
                </h2>
                <button
                  onClick={() => {
                    setEditNameValue(userName);
                    editNameSheet.open();
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="p-4 space-y-2">
          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="w-full flex items-center gap-3 p-4 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/30 dark:border-primary/40 active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            <Cloud className={`w-5 h-5 text-primary ${syncing ? 'animate-pulse' : ''}`} />
            <span className="flex-1 text-left font-medium text-primary">
              {syncing ? 'Syncing...' : 'Sync Now'}
            </span>
            {syncing && <RefreshCw className="w-4 h-4 text-primary animate-spin" />}
          </button>

          <button
            onClick={handleImport}
            className="w-full flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 active:scale-[0.98] transition-transform"
          >
            <Upload className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="flex-1 text-left font-medium">Import Bookmarks</span>
          </button>

          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 active:scale-[0.98] transition-transform"
          >
            <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="flex-1 text-left font-medium">Export Bookmarks</span>
          </button>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 active:scale-[0.98] transition-transform"
          >
            <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="flex-1 text-left font-medium text-red-600 dark:text-red-400">Sign Out</span>
          </button>
        </div>

        {/* Stats */}
        <div className="p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold mb-3">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{bookmarks.length}</div>
                <div className="text-sm text-gray-500">Bookmarks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{collections.length}</div>
                <div className="text-sm text-gray-500">Collections</div>
              </div>
            </div>
          </div>
        </div>

        {/* App info */}
        <div className="p-4 mt-4">
          <div className="text-center text-sm text-gray-500">
            <p>Bookmark Manager PWA</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Edit Name Bottom Sheet */}
      <BottomSheet isOpen={editNameSheet.isOpen} onClose={editNameSheet.close} title="Edit Name">
        <div className="p-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Display Name
            </label>
            <input
              id="name"
              type="text"
              value={editNameValue}
              onChange={(e) => setEditNameValue(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-primary focus:border-transparent"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={editNameSheet.close}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
            <button
              onClick={handleSaveName}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Save
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
