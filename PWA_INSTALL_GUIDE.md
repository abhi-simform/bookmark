# PWA Installation Guide

## Overview
Bookmark Manager is a Progressive Web App (PWA) that can be installed on your device for a native app-like experience with offline support.

## Features
- **Install on Any Device**: Works on phones, tablets, and desktop computers
- **Offline Access**: Access your bookmarks even without internet connection
- **Home Screen Icon**: Launch directly from your device's home screen
- **Full Screen Experience**: No browser UI clutter
- **Automatic Updates**: Always get the latest version

## Installation Methods

### Automatic Install Prompt
When you sign in to the app, you'll automatically see an install prompt at the bottom of the screen after 2 seconds. Simply:
1. Tap **"Install"** button
2. Confirm the installation
3. The app will be added to your home screen

You can dismiss the prompt by clicking "Not now" and it won't appear again for 7 days.

### Manual Installation

#### Android (Chrome/Edge)
1. Open the app in Chrome or Edge browser
2. Tap the three-dot menu (⋮) in the top-right corner
3. Select **"Install app"** or **"Add to Home screen"**
4. Follow the on-screen instructions
5. The app icon will appear on your home screen

#### iOS (Safari)
1. Open the app in Safari browser
2. Tap the Share button (□ with arrow) at the bottom
3. Scroll down and tap **"Add to Home Screen"**
4. Edit the name if desired
5. Tap **"Add"** in the top-right corner
6. The app icon will appear on your home screen

#### Desktop (Chrome/Edge/Opera)
1. Open the app in Chrome, Edge, or Opera browser
2. Look for the install icon (⊕ or computer icon) in the address bar
3. Click the install icon
4. Click **"Install"** in the popup dialog
5. The app will open in its own window

Alternatively:
1. Click the three-dot menu in the top-right corner
2. Select **"Install Bookmark Manager"** or **"Create shortcut"**
3. Check "Open as window" if available
4. Click **"Install"** or **"Create"**

### From Profile Page
If you miss the automatic prompt:
1. Go to the **Profile** tab (bottom navigation)
2. Look for the **"Install App"** button (green background)
3. Tap the button to trigger installation
4. Follow the browser's installation prompts

If you see **"App Installed"** instead, the app is already installed on your device.

## Benefits of Installing

### Performance
- Faster loading times
- Smoother animations and transitions
- Reduced data usage with offline caching

### User Experience
- No browser address bar or navigation buttons
- Full-screen immersive experience
- Native-like app feel
- Quick access from home screen/app drawer

### Offline Support
- View all your bookmarks without internet
- Add/edit bookmarks offline (syncs when online)
- Thumbnails and favicons cached locally
- Collections work offline

### Privacy
- Runs in isolated app window
- No browser history tracking
- Secure local data storage

## Troubleshooting

### Install Button Not Showing
**Possible reasons:**
1. **App Already Installed**: Check if you can open it from your home screen
2. **Browser Not Supported**: Use Chrome, Edge, Safari, or Opera
3. **HTTPS Required**: The app must be served over HTTPS (automatically handled on GitHub Pages)
4. **Criteria Not Met**: Browser needs to detect the app as installable (service worker + manifest)

### Can't Find Install Option
**Solutions:**
1. Update your browser to the latest version
2. Enable JavaScript if disabled
3. Clear browser cache and reload the page
4. Try a different browser (Chrome recommended)

### Installation Failed
**Steps to fix:**
1. Check your internet connection
2. Ensure you have enough storage space
3. Restart your browser and try again
4. Clear browser data and retry

### App Not Working Offline
**Verify:**
1. You've opened the app at least once while online
2. Service worker is registered (check browser DevTools > Application > Service Workers)
3. Data is cached (should happen automatically on first load)
4. Try force-refreshing the page (Ctrl/Cmd + Shift + R)

## Uninstalling the App

### Android
1. Long-press the app icon
2. Select **"App info"** or drag to "Uninstall"
3. Tap **"Uninstall"**

### iOS
1. Long-press the app icon
2. Tap **"Remove App"**
3. Tap **"Delete App"**
4. Confirm deletion

### Desktop
1. Right-click the app icon (taskbar/dock)
2. Select **"Uninstall"** or **"Remove from Chrome"**
3. Confirm uninstallation

Or from browser:
1. Open browser settings
2. Go to **"Apps"** or **"Installed Apps"**
3. Find "Bookmark Manager"
4. Click **"Uninstall"** or the three-dot menu > **"Uninstall"**

## Technical Details

### Service Worker
The app uses a service worker to cache resources and enable offline functionality:
- Caches HTML, CSS, and JavaScript files
- Stores API responses for offline access
- Updates automatically in the background

### Manifest
The web app manifest defines how the app appears when installed:
- Name: "Bookmark Manager"
- Short name: "Bookmarks"
- Icons: 64x64, 192x192, 512x512 (regular and maskable)
- Theme color: Indigo (#6366f1)
- Display mode: Standalone (full screen)

### Browser Support
- ✅ Chrome 76+ (Android, Desktop, ChromeOS)
- ✅ Edge 79+ (Windows, macOS, Android)
- ✅ Safari 13+ (iOS, iPadOS, macOS)
- ✅ Opera 62+ (Android, Desktop)
- ✅ Samsung Internet 12+ (Android)
- ❌ Firefox (limited PWA support)

## Privacy & Data

### What's Stored Locally
- Bookmarks (IndexedDB)
- Collections (IndexedDB)
- Thumbnails and favicons (IndexedDB)
- User preferences (localStorage)
- Cached app files (Service Worker Cache)

### What's Synced to Cloud
- Bookmarks metadata (title, URL, description, etc.)
- Collections (name, color, icon, etc.)
- User authentication data (Supabase)

**Note**: Thumbnails and favicons are NOT synced to the cloud, they're stored locally only.

## FAQs

**Q: Does installing the app take up much space?**
A: The app is very lightweight (~500 KB). Bookmarks and cached data will grow based on your usage, but typically remain under 10-20 MB.

**Q: Will I receive updates automatically?**
A: Yes! The app checks for updates automatically and installs them in the background. You'll always have the latest version.

**Q: Can I use the app on multiple devices?**
A: Yes! Your bookmarks sync across all devices where you're signed in. You can install the app on all your devices.

**Q: What happens if I clear my browser data?**
A: Local data will be deleted, but your bookmarks are safely stored in the cloud. Simply sign in again to restore everything.

**Q: Can I use it without installing?**
A: Absolutely! The app works great in the browser too. Installation just provides a better experience.

**Q: Does it work offline?**
A: Yes! Once installed, you can view and manage bookmarks offline. Changes sync automatically when you're back online.

## Support
If you encounter any issues with installation or the app, please:
1. Check this guide's troubleshooting section
2. Verify your browser is up to date
3. Try the app in a different browser
4. Open an issue on the GitHub repository

---

**Happy bookmarking! 📚✨**
