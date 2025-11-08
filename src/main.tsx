import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookmarksProvider } from './contexts/BookmarksContext';
import App from './App';
import './index.css';
import { initDB } from './lib/db';

// Initialize database
initDB().catch(console.error);

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = import.meta.env.MODE === 'production' ? '/bookmark/sw.js' : '/sw.js';
    navigator.serviceWorker.register(swPath).catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
  });
}

// Set basename for GitHub Pages deployment
const basename = import.meta.env.MODE === 'production' ? '/bookmark' : '/';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <BookmarksProvider>
          <App />
        </BookmarksProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
