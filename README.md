# Bookmark Manager PWA

A mobile-first Progressive Web App for managing bookmarks, built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- ✅ **Mobile-First Design** - Optimized for touch interactions on phones and tablets
- ✅ **Bottom Navigation** - Easy thumb-reach navigation on mobile devices
- ✅ **Floating Action Button** - Quick access to add bookmarks
- ✅ **Swipe Gestures** - Swipe to favorite or archive bookmarks
- ✅ **Pull-to-Refresh** - Natural refresh interaction for mobile
- ✅ **Bottom Sheets** - Native-like modal dialogs
- ✅ **PWA Support** - Install on your device and use offline
- ✅ **Touch-Friendly** - All buttons meet 44px minimum tap target size
- ✅ **Dark Mode** - Automatic dark mode support
- ✅ **IndexedDB Storage** - Fast local storage for bookmarks
- ✅ **Auto Metadata Fetching** - Automatically fetch title, description, and thumbnail from URLs
- ✅ **Collections** - Organize bookmarks into folders
- ✅ **Tags** - Tag bookmarks for easy filtering
- ✅ **Search** - Fast full-text search across all bookmarks
- ✅ **Responsive** - Works great on phones, tablets, and desktops

## 📱 Mobile-First Features

### Touch Interactions
- **Long Press** - Select multiple bookmarks
- **Swipe Left** - Archive bookmark
- **Swipe Right** - Add to favorites
- **Pull-to-Refresh** - Refresh bookmark list
- **Haptic Feedback** - Vibration feedback on interactions

### Mobile UI Components
- **Bottom Navigation** - Primary navigation at thumb-level
- **Floating Action Button (FAB)** - Quick add bookmark
- **Bottom Sheets** - Native-like modal sheets
- **Pull-to-Refresh** - Natural refresh gesture
- **Swipeable Cards** - Gesture-based actions
- **Touch-Friendly Forms** - Large inputs and buttons

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **IndexedDB (idb)** - Local database
- **Lucide React** - Icon library
- **React Spring** - Animation library
- **React Use Gesture** - Gesture handling
- **Workbox** - PWA service worker

## 📦 Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

## 🌐 PWA Installation

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home screen"
4. Tap "Add"

### Desktop (Chrome/Edge)
1. Open the app in Chrome or Edge
2. Click the install icon in the address bar
3. Click "Install"

## 📐 Mobile-First Design Principles

### Breakpoints
```css
/* Mobile (default): < 640px */
/* Tablet: 640px - 1023px */
/* Desktop: 1024px+ */
```

### Touch Targets
- Minimum size: 44x44px (iOS) / 48x48px (Android)
- Adequate spacing: 8px between interactive elements

### Typography
- Base font size: 16px (prevents mobile zoom)
- Line height: 1.5 for readability

### Performance
- Optimized images with lazy loading
- Code splitting for faster initial load
- Virtual scrolling for large lists
- Service worker caching

## 🎨 Customization

### Theme Colors
Edit the CSS variables in `src/index.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... more colors */
}
```

### Safe Area Support
The app automatically handles notched devices (iPhone X+) using CSS environment variables:
- `pb-safe-bottom` - Adds padding for home indicator
- `pt-safe-top` - Adds padding for status bar

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── mobile/          # Mobile-specific components
│   ├── bookmarks/       # Bookmark components
│   └── collections/     # Collection components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and libraries
├── pages/               # Page components
├── types/               # TypeScript types
└── main.tsx            # App entry point
```

### Key Files
- `vite.config.ts` - Vite and PWA configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `src/lib/db.ts` - IndexedDB database wrapper
- `src/lib/gestures.ts` - Touch gesture utilities
- `src/lib/haptics.ts` - Haptic feedback utilities

## 📝 Roadmap

- [ ] Firebase/Supabase cloud sync
- [ ] Authentication (Google, Email)
- [ ] Import from browser bookmarks
- [ ] Export bookmarks (HTML, JSON)
- [ ] Bulk URL paste and parsing
- [ ] Chrome extension for quick saving
- [ ] Share Target API integration
- [ ] Push notifications
- [ ] Analytics dashboard
- [ ] Collaborative collections
- [ ] Browser extension

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for component inspiration
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for the amazing utility framework
- [Vite](https://vitejs.dev/) for lightning-fast development

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for mobile users**
