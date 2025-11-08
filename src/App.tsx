import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BottomNav } from './components/mobile/BottomNav';
import { FAB } from './components/mobile/FAB';
import { BottomSheet } from './components/mobile/BottomSheet';
import { InstallPrompt } from './components/InstallPrompt';
import { useBottomSheet } from './hooks/useBottomSheet';
import { useCollections } from './hooks/useCollections';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import CollectionsPage from './pages/CollectionsPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AddBookmarkSheet from './components/bookmarks/AddBookmarkSheet';

function App() {
  const addBookmarkSheet = useBottomSheet();
  const { cleanupDuplicates } = useCollections();

  // Cleanup duplicate collections on app start
  useEffect(() => {
    cleanupDuplicates();
  }, []);

  const { user, loading, syncing } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show syncing indicator after login
  if (user && syncing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-4 px-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Syncing your bookmarks...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            This will just take a moment
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth routes
  if (!user) {
    return (
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    );
  }

  // If authenticated, show main app
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16">
      {/* Main Content */}
      <main className="h-full">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collections"
            element={
              <ProtectedRoute>
                <CollectionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collections/:collectionId"
            element={
              <ProtectedRoute>
                <CollectionDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Floating Action Button */}
      <FAB
        onClick={addBookmarkSheet.open}
        label="Add Bookmark"
      />

      {/* Add Bookmark Bottom Sheet */}
      <BottomSheet
        isOpen={addBookmarkSheet.isOpen}
        onClose={addBookmarkSheet.close}
        title="Add Bookmark"
      >
        <AddBookmarkSheet onClose={addBookmarkSheet.close} />
      </BottomSheet>

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
}

export default App;
