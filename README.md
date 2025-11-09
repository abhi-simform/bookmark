# Bookmark Manager PWA

A mobile-first Progressive Web App for managing bookmarks with offline support and cloud sync, built with React, TypeScript, Tailwind CSS, and Supabase.

🔗 **Live Demo:** [https://abhi-simform.github.io/bookmark/](https://abhi-simform.github.io/bookmark/)

## 🚀 Features

### Core Features
- ✅ **Mobile-First Design** - Optimized for touch interactions on phones and tablets
- ✅ **PWA Support** - Install on your device and use offline with service workers
- ✅ **Cloud Sync** - Automatic bidirectional sync with Supabase
- ✅ **Offline-First** - Works completely offline with IndexedDB storage
- ✅ **Authentication** - Secure user authentication with Supabase Auth
- ✅ **User Approval System** - Admin dashboard to approve new users
- ✅ **Collections** - Organize bookmarks into folders with full CRUD operations
- ✅ **Smart Install Prompts** - Browser and device-specific installation instructions
- ✅ **Auto Metadata Fetching** - Automatically fetch title, description, and thumbnails from URLs
- ✅ **Background Sync** - Thumbnail fetching happens in the background without blocking UI
- ✅ **Import/Export** - Export bookmarks to JSON or import from backup files
- ✅ **Dark Mode** - Automatic dark mode support

### Mobile UI Features
- ✅ **Bottom Navigation** - Easy thumb-reach navigation
- ✅ **Floating Action Button** - Quick access to add bookmarks
- ✅ **Bottom Sheets** - Native-like modal dialogs
- ✅ **Pull-to-Refresh** - Natural refresh interaction
- ✅ **Swipe Gestures** - Swipe actions on bookmark cards
- ✅ **Touch-Friendly** - All buttons meet 44px minimum tap target size
- ✅ **Safe Area Support** - Proper handling of notched devices

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

### Frontend
- **React 18** - UI library with hooks
- **TypeScript** - Type safety and better DX
- **Vite 5** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **React Router** - Client-side routing with GitHub Pages support
- **Lucide React** - Beautiful icon library
- **React Spring** - Smooth animations
- **React Use Gesture** - Touch gesture handling

### Backend & Storage
- **Supabase** - Backend-as-a-Service (PostgreSQL, Auth, Real-time)
- **IndexedDB (idb)** - Local offline storage
- **Supabase Auth** - User authentication and authorization
- **Row Level Security (RLS)** - Database security per user

### PWA & Performance
- **vite-plugin-pwa** - PWA configuration and service worker generation
- **Workbox** - Service worker strategies and caching
- **Auto-update Service Worker** - Seamless app updates
- **Background Sync** - Automatic cloud synchronization

## 📦 Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- A Supabase account (free tier available)

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/abhi-simform/bookmark.git
cd bookmark
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API
   - Copy your project URL and anon key
   - Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up the database**
   - Go to Supabase SQL Editor
   - Run the following SQL to create tables:
```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  favicon TEXT,
  collection_id TEXT,
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  type TEXT DEFAULT 'link',
  platform TEXT DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create collections table
CREATE TABLE collections (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  icon TEXT DEFAULT 'folder',
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admins table
CREATE TABLE admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookmarks
CREATE POLICY "Users can view own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookmarks" ON bookmarks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for collections
CREATE POLICY "Users can view own collections" ON collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own collections" ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own collections" ON collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own collections" ON collections FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can update all profiles" ON user_profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, is_approved)
  VALUES (NEW.id, NEW.email, false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

5. **Make yourself an admin (optional)**
   - Sign up for an account in the app
   - In Supabase SQL Editor, run:
```sql
INSERT INTO admins (user_id) VALUES ('your-user-id-here');
UPDATE user_profiles SET is_approved = true WHERE id = 'your-user-id-here';
```

6. **Start the development server**
```bash
npm run dev
```
Visit `http://localhost:5173/`

7. **Build for production**
```bash
npm run build
```

8. **Deploy to GitHub Pages**
```bash
npm run deploy
```

## 🌐 PWA Installation

The app includes smart installation prompts that automatically detect your device and browser to show appropriate instructions.

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button (⎙) at the bottom
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (⋮) at the top right
3. Tap "Add to Home screen" or "Install app"
4. Tap "Install"

### Android (Samsung Internet)
1. Open the app
2. Tap the menu (⋮) at the bottom
3. Tap "Add page to"
4. Select "Home screen"

### Desktop (Chrome/Edge)
1. Open the app in Chrome or Edge
2. Look for the install icon (⊕) in the address bar
3. Click "Install"

**Note:** The app shows an installation prompt 2 seconds after you sign in, with specific instructions for your device and browser!

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
│   ├── auth/            # Authentication components
│   ├── bookmarks/       # Bookmark CRUD components
│   ├── mobile/          # Mobile-specific UI components
│   └── InstallPrompt.tsx # PWA installation prompt
├── contexts/
│   ├── AuthContext.tsx  # Authentication state management
│   └── BookmarksContext.tsx # Bookmarks state management
├── hooks/               # Custom React hooks
│   ├── useBookmarks.ts  # Bookmark operations
│   ├── useCollections.ts # Collection operations
│   └── useInstallPrompt.ts # PWA install detection
├── lib/
│   ├── db.ts           # IndexedDB wrapper
│   ├── supabase.ts     # Supabase client configuration
│   ├── sync.ts         # Cloud synchronization logic
│   ├── metadata.ts     # URL metadata fetching
│   └── thumbnails.ts   # Background thumbnail service
├── pages/              # Page components
│   ├── HomePage.tsx    # Main bookmarks view
│   ├── CollectionsPage.tsx # Collections overview
│   ├── ProfilePage.tsx # User profile and settings
│   ├── SignInPage.tsx  # Authentication
│   └── AdminPage.tsx   # User approval dashboard
├── types/              # TypeScript type definitions
└── main.tsx           # App entry point
```

### Key Files
- `vite.config.ts` - Vite and PWA configuration with GitHub Pages support
- `tailwind.config.js` - Tailwind CSS configuration
- `src/lib/db.ts` - IndexedDB database wrapper for offline storage
- `src/lib/sync.ts` - Bidirectional sync between IndexedDB and Supabase
- `src/lib/supabase.ts` - Supabase client and type definitions
- `src/contexts/AuthContext.tsx` - Authentication and user approval logic
- `public/manifest.webmanifest` - PWA manifest (auto-generated by vite-plugin-pwa)

## ✨ Key Features Explained

### Offline-First Architecture
- **IndexedDB** stores all data locally for instant access
- **Background Sync** automatically syncs with Supabase when online
- **Conflict Resolution** uses "newest wins" strategy for data conflicts
- **Works Completely Offline** - add, edit, delete bookmarks without internet

### Cloud Synchronization
- **Automatic Sync** on login and after CRUD operations
- **Bidirectional Sync** between local IndexedDB and Supabase
- **Initial Sync** fetches all cloud data on first login
- **Incremental Updates** only syncs changed data
- **Manual Sync Button** in profile page for force sync

### User Approval System
- **New User Registration** creates unapproved accounts
- **Admin Dashboard** at `/admin` to approve/revoke users
- **Pending Approval Screen** shows waiting message to unapproved users
- **Row Level Security** ensures users only see their own data

### Smart PWA Installation
- **Auto-Detection** identifies user's device and browser
- **Custom Instructions** shows platform-specific installation steps
- **Install Prompt** appears 2 seconds after login
- **Manual Install Button** available in Profile page

### Background Services
- **Thumbnail Fetching** happens in background after login
- **Rate Limited** API calls to respect metadata service
- **Fallback Icons** show immediately while thumbnails load
- **Non-Blocking** UI remains responsive during background tasks

## 📝 Roadmap

### Completed ✅
- [x] Supabase cloud sync with offline-first architecture
- [x] Email authentication with user approval system
- [x] Export bookmarks (JSON format)
- [x] Import bookmarks from JSON backup
- [x] PWA installation with smart prompts
- [x] Background thumbnail fetching
- [x] Admin dashboard for user management
- [x] GitHub Pages deployment

### Planned 🎯
- [ ] Full-text search with mobile optimization
- [ ] Google OAuth authentication
- [ ] Import from browser bookmarks (HTML)
- [ ] Bulk URL paste and parsing
- [ ] Share Target API integration
- [ ] Chrome/Firefox extension for quick saving
- [ ] Push notifications for sync conflicts
- [ ] Collaborative collections (share with others)
- [ ] Analytics dashboard (most visited, tags analysis)
- [ ] Custom themes and color schemes

## 🚀 Deployment

### GitHub Pages
The app is configured for GitHub Pages deployment:

1. Update `base` path in `vite.config.ts` if needed (currently set to `/bookmark/`)
2. Update `basename` in `src/main.tsx` to match
3. Run deployment:
```bash
npm run deploy
```

This will build and deploy to `gh-pages` branch automatically.

### Custom Domain
To deploy to a custom domain:
1. Remove or update the `base` path in `vite.config.ts`
2. Update `basename` in `src/main.tsx`
3. Build and deploy to your hosting provider

### Environment Variables
Required environment variables for deployment:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## 🔒 Security

- **Row Level Security (RLS)** enabled on all Supabase tables
- **User-specific data** - users can only access their own bookmarks and collections
- **Admin-only access** - user approval system restricts new registrations
- **Secure authentication** - handled by Supabase Auth
- **Environment variables** - sensitive keys stored in environment variables

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the amazing backend-as-a-service
- [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components
- [Lucide](https://lucide.dev/) for the comprehensive icon library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for lightning-fast development experience
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) for seamless PWA integration

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

## 🌟 Show Your Support

If you find this project useful, please consider giving it a ⭐️ on GitHub!

---

**Made with ❤️ for mobile-first bookmark management**
