# Supabase Integration Guide

## ✅ Step 1: Install Supabase (COMPLETED)
The Supabase client library has been installed.

## 📝 Step 2: Add Your Credentials

1. **Open the `.env` file** in your project root
2. **Replace the placeholders** with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...
```

**Where to find these:**
- Go to your Supabase dashboard: https://supabase.com/dashboard
- Select your project
- Click **Settings** (⚙️) in the sidebar
- Go to **API** section
- Copy:
  - **Project URL** → `VITE_SUPABASE_URL`
  - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## 🗄️ Step 3: Create Database Tables

Go to your Supabase dashboard and run this SQL:

### SQL Script to Create Tables

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create collections table
CREATE TABLE collections (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    parent_id TEXT REFERENCES collections(id) ON DELETE CASCADE,
    "order" INTEGER DEFAULT 0,
    created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000,
    last_modified_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
);

-- Create bookmarks table
CREATE TABLE bookmarks (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    favicon TEXT,
    thumbnail TEXT,
    type TEXT DEFAULT 'website',
    platform TEXT,
    collection_id TEXT REFERENCES collections(id) ON DELETE SET NULL NOT NULL,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_favorite BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000,
    last_modified_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
);

-- Create tags table
CREATE TABLE tags (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    color TEXT,
    created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000,
    UNIQUE(user_id, name)
);

-- Create indexes for better performance
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_collection_id ON bookmarks(collection_id);
CREATE INDEX idx_bookmarks_is_favorite ON bookmarks(is_favorite);
CREATE INDEX idx_bookmarks_is_archived ON bookmarks(is_archived);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at);
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collections_parent_id ON collections(parent_id);
CREATE INDEX idx_tags_user_id ON tags(user_id);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Create policies for bookmarks
CREATE POLICY "Users can view their own bookmarks"
    ON bookmarks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
    ON bookmarks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks"
    ON bookmarks FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
    ON bookmarks FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for collections
CREATE POLICY "Users can view their own collections"
    ON collections FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own collections"
    ON collections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
    ON collections FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
    ON collections FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for tags
CREATE POLICY "Users can view their own tags"
    ON tags FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tags"
    ON tags FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags"
    ON tags FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags"
    ON tags FOR DELETE
    USING (auth.uid() = user_id);

-- Create a function to automatically create a default Miscellaneous collection for new users
CREATE OR REPLACE FUNCTION create_default_collection()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO collections (user_id, name, description, "order")
    VALUES (NEW.id, 'Miscellaneous', 'Default collection for all bookmarks', 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to run the function when a new user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_collection();
```

**How to run this SQL:**
1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Paste the entire SQL script above
4. Click **Run** (or press Cmd/Ctrl + Enter)

## 🔐 Step 4: Enable Authentication Providers

In your Supabase dashboard:

1. Go to **Authentication** → **Providers**
2. Enable the providers you want:
   - **Email** (enabled by default)
   - **Google** (recommended for easier sign-in)
   - **GitHub** (optional)

### For Google OAuth (Recommended):
1. Enable Google provider in Supabase
2. Follow the instructions to create Google OAuth credentials
3. Add the credentials to Supabase

## 🚀 Step 5: Restart Your Development Server

After adding your credentials to `.env`:

```bash
# Stop the current dev server (Ctrl+C if running)
npm run dev
```

## 📋 Files Created

✅ `/src/lib/supabase.ts` - Supabase client configuration
✅ `/src/lib/database.types.ts` - TypeScript types for your database
✅ `/src/vite-env.d.ts` - Environment variable types
✅ `/.env` - Environment variables (add your credentials here)

## 🎯 Next Steps

After completing the steps above, I can help you with:

1. **Create Authentication Pages**
   - Sign in / Sign up forms
   - Password reset
   - Google OAuth button
   - Protected routes

2. **Implement Sync Logic**
   - Sync IndexedDB ↔ Supabase
   - Offline-first with background sync
   - Conflict resolution

3. **Add User Profile**
   - User settings
   - Account management
   - Data export/import

4. **Real-time Features**
   - Live sync across devices
   - Presence indicators
   - Real-time updates

## 🔒 Security Notes

- **Row Level Security (RLS)** is enabled - users can only access their own data
- **anon key** is safe to use in client-side code
- Never commit your `.env` file to git (it's already in `.gitignore`)

## ❓ Troubleshooting

If you get errors:
1. Make sure you've added your credentials to `.env`
2. Restart the dev server after changing `.env`
3. Check that all SQL scripts ran successfully
4. Verify RLS policies are enabled in Supabase dashboard

---

**Ready to continue?** Once you've:
1. Added your credentials to `.env`
2. Run the SQL script in Supabase
3. Restarted your dev server

Let me know and I'll help you build the authentication system and sync logic!
