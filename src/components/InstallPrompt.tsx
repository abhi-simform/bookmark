import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isInstalled =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    if (isInstalled) {
      return;
    }

    // Show prompt after 2 seconds if not installed
    const showTimer = setTimeout(() => {
      setShowPrompt(true);
    }, 2000);

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(showTimer);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  // Don't show prompt if not supposed to show
  if (!showPrompt) {
    return null;
  }

  // Detect device and browser for instructions
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
  const isChrome = /Chrome/i.test(navigator.userAgent) && !/Edg/i.test(navigator.userAgent);
  const isFirefox = /Firefox/i.test(navigator.userAgent);
  const isSamsung = /SamsungBrowser/i.test(navigator.userAgent);

  let instructions = '';

  if (isIOS && isSafari) {
    instructions =
      'Tap the Share button (⎙) at the bottom, then tap "Add to Home Screen" to install this app!';
  } else if (isAndroid && isChrome) {
    instructions =
      'Tap the menu (⋮) at the top right, then tap "Add to Home screen" or "Install app" to install!';
  } else if (isAndroid && isSamsung) {
    instructions =
      'Tap the menu (⋮) at the bottom, then tap "Add page to" and select "Home screen" to install!';
  } else if (isAndroid && isFirefox) {
    instructions =
      'Tap the menu (⋮) at the top right, then tap "Install" to add this app to your home screen!';
  } else if (isMobile) {
    instructions =
      'Open your browser menu and look for "Add to Home screen" or "Install" to install this app!';
  } else {
    instructions = "Click the install icon in your browser's address bar to install this app!";
  }

  // Show the prompt with appropriate content
  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
            <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Install Bookmark Manager
            </h3>
            {deferredPrompt ? (
              <>
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                  Install our app for quick access and offline use. Works on your home screen!
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={handleInstall}
                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Install
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                  >
                    Not now
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">{instructions}</p>

                <button
                  onClick={handleDismiss}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                >
                  Got it
                </button>
              </>
            )}
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
